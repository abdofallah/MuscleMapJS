/**
 * MuscleMapJS — Body Renderer (Canvas2D)
 * Ported from BodyRenderer.swift
 * 
 * Core rendering engine. Draws body parts on a canvas context,
 * performs hit testing, and computes bounding rects.
 */
import type {
  BodyGender, BodySide, BodyViewStyle, Muscle, MuscleHighlight,
  MuscleFill, MuscleSide, BodyPartPathData, BodySlug,
} from '../types';
import { getBodyPaths, getViewBox } from './body-path-data';
import { slugToMuscle, isSubGroup, isAlwaysVisibleSubGroup, getParentGroup } from './muscles';

export class BodyRenderer {
  private gender: BodyGender;
  private side: BodySide;
  private highlights: Map<Muscle, MuscleHighlight>;
  private style: BodyViewStyle;
  private selectedMuscles: Set<Muscle>;
  private hideSubGroups: boolean;

  // Cached transform values (in CSS pixel space, before DPR)
  private _scale = 1;
  private _offsetX = 0;
  private _offsetY = 0;

  constructor(
    gender: BodyGender,
    side: BodySide,
    highlights: Map<Muscle, MuscleHighlight>,
    style: BodyViewStyle,
    selectedMuscles: Set<Muscle>,
    hideSubGroups = true,
  ) {
    this.gender = gender;
    this.side = side;
    this.highlights = highlights;
    this.style = style;
    this.selectedMuscles = selectedMuscles;
    this.hideSubGroups = hideSubGroups;
  }

  /** Compute scale and offset for the given CSS pixel size. */
  private computeTransform(cssWidth: number, cssHeight: number) {
    const vb = getViewBox(this.gender, this.side);
    this._scale = Math.min(cssWidth / vb.width, cssHeight / vb.height);
    this._offsetX = (cssWidth - vb.width * this._scale) / 2 - vb.originX * this._scale;
    this._offsetY = (cssHeight - vb.height * this._scale) / 2 - vb.originY * this._scale;
  }

  /** Render all body parts onto the canvas context. */
  render(ctx: CanvasRenderingContext2D, cssWidth: number, cssHeight: number, dpr = 1) {
    this.computeTransform(cssWidth, cssHeight);
    const parts = getBodyPaths(this.gender, this.side);

    for (const part of parts) {
      const muscle = slugToMuscle(part.slug);

      // Skip non-visible sub-groups
      if (this.hideSubGroups && muscle && isSubGroup(muscle) && !isAlwaysVisibleSubGroup(muscle)) {
        continue;
      }

      const highlight = muscle ? this.highlights.get(muscle) : undefined;
      const isSelected = this.isMuscleSelected(muscle);
      const fillColor = this.resolveFillColor(part.slug, highlight, isSelected);

      const allPaths = [
        ...part.common.map(p => ({ d: p, side: 'both' as MuscleSide })),
        ...part.left.map(p => ({ d: p, side: 'left' as MuscleSide })),
        ...part.right.map(p => ({ d: p, side: 'right' as MuscleSide })),
      ];

      const hasShadow = this.style.shadowRadius > 0 && highlight;
      const opacity = highlight?.opacity ?? 1;

      for (const { d } of allPaths) {
        const path = new Path2D(d);

        ctx.save();
        // Combine DPR + viewBox transform into one setTransform call
        const s = this._scale * dpr;
        const ox = this._offsetX * dpr;
        const oy = this._offsetY * dpr;
        ctx.setTransform(s, 0, 0, s, ox, oy);

        // Shadow
        if (hasShadow) {
          ctx.shadowColor = this.style.shadowColor;
          ctx.shadowBlur = this.style.shadowRadius * dpr;
          ctx.shadowOffsetX = this.style.shadowOffsetX * dpr;
          ctx.shadowOffsetY = this.style.shadowOffsetY * dpr;
        }

        // Fill with opacity
        if (opacity < 1 && highlight) {
          ctx.globalAlpha = opacity;
        }

        // Apply fill
        const fill = highlight?.fill;
        if (fill && fill.type === 'linearGradient') {
          const grad = ctx.createLinearGradient(
            fill.startX * 100, fill.startY * 100,
            fill.endX * 100, fill.endY * 100
          );
          const step = 1 / Math.max(1, fill.colors.length - 1);
          fill.colors.forEach((c, i) => grad.addColorStop(i * step, c));
          ctx.fillStyle = grad;
        } else if (fill && fill.type === 'radialGradient') {
          const grad = ctx.createRadialGradient(
            fill.centerX * 100, fill.centerY * 100, fill.startRadius,
            fill.centerX * 100, fill.centerY * 100, fill.endRadius
          );
          const step = 1 / Math.max(1, fill.colors.length - 1);
          fill.colors.forEach((c, i) => grad.addColorStop(i * step, c));
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = fillColor;
        }

        ctx.fill(path);

        // Reset shadow before stroke
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Stroke
        if (this.style.strokeWidth > 0) {
          ctx.strokeStyle = this.style.strokeColor;
          ctx.lineWidth = this.style.strokeWidth / this._scale;
          ctx.stroke(path);
        }

        // Selection stroke
        if (isSelected) {
          ctx.strokeStyle = this.style.selectionStrokeColor;
          ctx.lineWidth = this.style.selectionStrokeWidth / this._scale;
          ctx.stroke(path);
        }

        ctx.restore();
      }
    }
  }

  /**
   * Hit test: find which muscle was clicked at the given CSS pixel coordinates
   * (relative to the canvas element).
   * Sub-groups are tested before parent groups for priority.
   */
  hitTest(ctx: CanvasRenderingContext2D, cssX: number, cssY: number, cssWidth: number, cssHeight: number): { muscle: Muscle; side: MuscleSide } | null {
    this.computeTransform(cssWidth, cssHeight);
    const parts = getBodyPaths(this.gender, this.side);

    // Convert CSS click coordinates to SVG path coordinates (inverse of render transform)
    const pathX = (cssX - this._offsetX) / this._scale;
    const pathY = (cssY - this._offsetY) / this._scale;

    // Sort: sub-groups first for priority hit testing
    const sorted = [...parts].sort((a, b) => {
      const aIsSub = slugToMuscle(a.slug) ? isSubGroup(slugToMuscle(a.slug)!) : false;
      const bIsSub = slugToMuscle(b.slug) ? isSubGroup(slugToMuscle(b.slug)!) : false;
      if (aIsSub !== bIsSub) return aIsSub ? -1 : 1;
      return 0;
    });

    for (const part of sorted) {
      const muscle = slugToMuscle(part.slug);
      if (!muscle) continue;
      if (this.hideSubGroups && isSubGroup(muscle) && !isAlwaysVisibleSubGroup(muscle)) continue;

      // Always-visible sub-groups return parent when sub-groups hidden
      const resolvedMuscle = (this.hideSubGroups && isAlwaysVisibleSubGroup(muscle))
        ? (getParentGroup(muscle) ?? muscle)
        : muscle;

      // Test left paths (using identity transform + untransformed path coordinates)
      for (const d of part.left) {
        if (this.pointInPath(ctx, d, pathX, pathY)) {
          return { muscle: resolvedMuscle, side: 'left' };
        }
      }

      // Test right paths
      for (const d of part.right) {
        if (this.pointInPath(ctx, d, pathX, pathY)) {
          return { muscle: resolvedMuscle, side: 'right' };
        }
      }

      // Test common paths
      for (const d of part.common) {
        if (this.pointInPath(ctx, d, pathX, pathY)) {
          return { muscle: resolvedMuscle, side: 'both' };
        }
      }
    }

    return null;
  }

  /**
   * Check if a point (in SVG path-space coordinates) is inside an SVG path.
   * Uses identity transform so path and point are in the same coordinate system.
   */
  private pointInPath(ctx: CanvasRenderingContext2D, pathD: string, pathX: number, pathY: number): boolean {
    const path = new Path2D(pathD);
    ctx.save();
    // Use identity transform — both the path and the point are in SVG path-space
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const hit = ctx.isPointInPath(path, pathX, pathY);
    ctx.restore();
    return hit;
  }

  /** Check if a muscle is selected (including always-visible parent inheritance). */
  private isMuscleSelected(muscle: Muscle | undefined): boolean {
    if (!muscle) return false;
    if (this.selectedMuscles.has(muscle)) return true;
    if (this.hideSubGroups && isAlwaysVisibleSubGroup(muscle)) {
      const parent = getParentGroup(muscle);
      if (parent && this.selectedMuscles.has(parent)) return true;
    }
    return false;
  }

  /** Resolve the fill color for a body part. */
  private resolveFillColor(slug: BodySlug, highlight: MuscleHighlight | undefined, isSelected: boolean): string {
    if (slug === 'hair') return this.style.hairColor;
    if (slug === 'head') return this.style.headColor;
    if (isSelected) return this.style.selectionColor;
    if (highlight) {
      if (highlight.fill.type === 'color') return highlight.fill.color;
      return highlight.fill.colors?.[0] ?? this.style.defaultFillColor;
    }
    // Sub-group inheritance: use parent's highlight
    const muscle = slugToMuscle(slug);
    if (muscle) {
      const parent = getParentGroup(muscle);
      if (parent) {
        const parentHighlight = this.highlights.get(parent);
        if (parentHighlight) {
          if (parentHighlight.fill.type === 'color') return parentHighlight.fill.color;
          return parentHighlight.fill.colors?.[0] ?? this.style.defaultFillColor;
        }
      }
    }
    return this.style.defaultFillColor;
  }

  // ─── Public: Transform Accessors ──────────────────────────────────────────

  /** Get the current computed transform values (must call render/hitTest first to populate). */
  getTransform(): { scale: number; offsetX: number; offsetY: number } {
    return { scale: this._scale, offsetX: this._offsetX, offsetY: this._offsetY };
  }

  // ─── Public: Bounding Rect ────────────────────────────────────────────────

  /**
   * Returns the bounding rect (in CSS pixels) of a muscle's combined paths.
   * Must call computeTransform before using (hitTest/render do this automatically).
   * Ported from BodyRenderer.swift boundingRect(for:in:)
   */
  boundingRect(muscle: Muscle, cssWidth: number, cssHeight: number): { x: number; y: number; width: number; height: number } | null {
    this.computeTransform(cssWidth, cssHeight);
    const parts = getBodyPaths(this.gender, this.side);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let found = false;

    for (const part of parts) {
      const partMuscle = slugToMuscle(part.slug);
      if (partMuscle !== muscle) continue;

      for (const d of [...part.common, ...part.left, ...part.right]) {
        // We use a temporary canvas to compute bounding rect
        // by sampling the path. Since Path2D doesn't expose a
        // native bounding box API, we scan the SVG path commands manually.
        const bbox = this.computePathBBox(d);
        if (!bbox) continue;
        found = true;

        // Transform from SVG path-space to CSS pixel-space
        const x1 = bbox.x * this._scale + this._offsetX;
        const y1 = bbox.y * this._scale + this._offsetY;
        const x2 = (bbox.x + bbox.width) * this._scale + this._offsetX;
        const y2 = (bbox.y + bbox.height) * this._scale + this._offsetY;

        minX = Math.min(minX, x1);
        minY = Math.min(minY, y1);
        maxX = Math.max(maxX, x2);
        maxY = Math.max(maxY, y2);
      }
    }

    if (!found) return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  /**
   * Compute bounding box of an SVG path string by parsing coordinate values.
   * This is a lightweight scan — it extracts all numeric coordinate pairs from
   * the path commands without fully executing them. Accurate enough for
   * bounding rects (tooltip/a11y positioning).
   */
  private computePathBBox(d: string): { x: number; y: number; width: number; height: number } | null {
    // Extract all numbers from the path string
    const nums = d.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);
    if (!nums || nums.length < 2) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Walk through command chars and their coordinate pairs
    let i = 0;
    const chars = d.replace(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi, '\0').replace(/[,\s]+/g, '');
    let numIdx = 0;

    // Simple approach: just pair all numbers as x,y coordinates
    // This works because SVG path coordinates are always x,y pairs
    // (except for H, V, A which we approximate)
    const values = nums.map(Number);
    for (let j = 0; j < values.length - 1; j += 2) {
      const x = values[j];
      const y = values[j + 1];
      // Skip obviously wrong values (e.g., arc flags 0/1)
      if (Math.abs(x) < 2 && Math.abs(y) < 2) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    if (minX === Infinity) return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
}
