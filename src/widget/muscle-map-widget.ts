/**
 * MuscleMapJS — Main Widget
 * 
 * The primary public class that creates an interactive muscle map.
 * Drop-in replacement for BodyView (SwiftUI) / MuscleMapView (UIKit).
 * 
 * Usage:
 *   const map = new MuscleMapWidget(container, { gender: 'female', side: 'front' });
 *   map.highlight('chest', '#ff0000');
 *   map.on('muscleClick', (e) => console.log(e.muscle));
 *   const selected = map.getHighlightedMuscles(); // ['chest']
 */
import type {
  BodyGender, BodySide, Muscle, MuscleSide, MuscleHighlight,
  MuscleFill, MuscleMapOptions, MuscleEvent, BodyViewStyle,
  StylePreset, HeatmapConfig, MuscleIntensity, ColorScalePreset,
  GradientDirection,
} from '../types';
import { BodyRenderer } from '../core/body-renderer';
import { resolveStyle, STYLE_DEFAULT } from '../styles/body-view-style';
import { resolveColorScale } from '../heatmap/color-scale';
import { MUSCLE_DISPLAY_NAMES } from '../core/muscles';
import { interpolateCSS } from '../utils/color';

type EventType = 'muscleClick' | 'muscleEnter' | 'muscleLeave' | 'selectionChange';
type EventHandler = (...args: any[]) => void;

export class MuscleMapWidget {
  // ─── State ───────────────────────────────────────────────────────────────
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;

  private gender: BodyGender;
  private side: BodySide;
  private style: BodyViewStyle;
  private interactive: boolean;
  private multiSelect: boolean;
  private hideSubGroups: boolean;

  private highlights = new Map<Muscle, MuscleHighlight>();
  private selectedMuscles = new Set<Muscle>();
  private hoveredMuscle: Muscle | null = null;

  private eventHandlers = new Map<EventType, Set<EventHandler>>();
  private resizeObserver: ResizeObserver | null = null;
  private destroyed = false;

  // Animation state
  private _animated = false;
  private _animDuration = 300; // ms
  private _prevHighlights = new Map<Muscle, MuscleHighlight>();
  private _animProgress = 1;
  private _animRAF = 0;
  private _animStartTime = 0;

  // Pulse state
  private _pulseEnabled = false;
  private _pulseSpeed = 1.5;
  private _pulseMin = 0.6;
  private _pulseMax = 1.0;
  private _pulseRAF = 0;

  // Gestures
  private _longPressTimer = 0;
  private _longPressDuration = 500;
  private _isDragging = false;
  private _lastDragMuscle: Muscle | null = null;

  // Tooltip
  private _tooltipEl: HTMLElement | null = null;
  private _tooltipEnabled = false;
  private _tooltipRenderer: ((muscle: Muscle, side: MuscleSide) => string) | null = null;

  // Selection history
  private _historyEnabled = false;
  private _undoStack: Set<Muscle>[] = [];
  private _redoStack: Set<Muscle>[] = [];
  private _historyMax = 50;

  // ─── Constructor ─────────────────────────────────────────────────────────

  constructor(container: HTMLElement, options: MuscleMapOptions = {}) {
    this.container = container;
    this.gender = options.gender ?? 'male';
    this.side = options.side ?? 'front';
    this.style = resolveStyle(options.style ?? 'default');
    this.interactive = options.interactive ?? true;
    this.multiSelect = options.multiSelect ?? true;
    this.hideSubGroups = !(options.showSubGroups ?? false);

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.touchAction = 'none';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Interactive muscle map');
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;

    // Wire up callback-style options
    if (options.onMuscleClick) this.on('muscleClick', options.onMuscleClick);
    if (options.onMuscleEnter) this.on('muscleEnter', options.onMuscleEnter);
    if (options.onMuscleLeave) this.on('muscleLeave', options.onMuscleLeave);
    if (options.onSelectionChange) this.on('selectionChange', options.onSelectionChange);

    // Bind interactions (unified pointer events for tap/long-press/drag)
    if (this.interactive) {
      this.canvas.addEventListener('pointerdown', this.handlePointerDown);
      this.canvas.addEventListener('pointermove', this.handlePointerMove);
      this.canvas.addEventListener('pointerup', this.handlePointerUp);
      this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
    }

    // Size & first paint
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  // ─── Public API: Highlighting ────────────────────────────────────────────

  /** Highlight a muscle with a color (CSS string). */
  highlight(muscle: Muscle, color: string, opacity = 1) {
    this.highlights.set(muscle, {
      muscle,
      fill: { type: 'color', color },
      opacity,
    });
    this.draw();
  }

  /** Highlight multiple muscles with the same color. */
  highlightMany(muscles: Muscle[], color: string, opacity = 1) {
    for (const m of muscles) {
      this.highlights.set(m, {
        muscle: m,
        fill: { type: 'color', color },
        opacity,
      });
    }
    this.draw();
  }

  /** Highlight a muscle with a linear gradient. */
  highlightLinearGradient(
    muscle: Muscle,
    colors: string[],
    startX = 0, startY = 0, endX = 0, endY = 1,
    opacity = 1
  ) {
    this.highlights.set(muscle, {
      muscle,
      fill: { type: 'linearGradient', colors, startX, startY, endX, endY },
      opacity,
    });
    this.draw();
  }

  /** Highlight a muscle with a radial gradient. */
  highlightRadialGradient(
    muscle: Muscle,
    colors: string[],
    centerX = 0.5, centerY = 0.5, startRadius = 0, endRadius = 40,
    opacity = 1
  ) {
    this.highlights.set(muscle, {
      muscle,
      fill: { type: 'radialGradient', colors, centerX, centerY, startRadius, endRadius },
      opacity,
    });
    this.draw();
  }

  /** Apply a full MuscleHighlight object. */
  setHighlight(muscle: Muscle, highlight: MuscleHighlight) {
    this.highlights.set(muscle, highlight);
    this.draw();
  }

  /** Remove highlight from a muscle. */
  removeHighlight(muscle: Muscle) {
    this.highlights.delete(muscle);
    this.draw();
  }

  /** Clear all highlights. */
  clearHighlights() {
    this.highlights.clear();
    this.draw();
  }

  /** Get all currently highlighted muscles as an array. */
  getHighlightedMuscles(): Muscle[] {
    return Array.from(this.highlights.keys());
  }

  /** Get the full highlight data for serialization/restoration. */
  getHighlightData(): Array<{ muscle: Muscle; color: string; opacity: number }> {
    const result: Array<{ muscle: Muscle; color: string; opacity: number }> = [];
    for (const [muscle, h] of this.highlights) {
      const color = h.fill.type === 'color' ? h.fill.color : h.fill.colors?.[0] ?? '';
      result.push({ muscle, color, opacity: h.opacity });
    }
    return result;
  }

  /** Restore highlights from saved data. */
  setHighlightData(data: Array<{ muscle: Muscle; color: string; opacity?: number }>) {
    this.highlights.clear();
    for (const d of data) {
      this.highlights.set(d.muscle, {
        muscle: d.muscle,
        fill: { type: 'color', color: d.color },
        opacity: d.opacity ?? 1,
      });
    }
    this.draw();
  }

  // ─── Public API: Heatmap / Intensities ───────────────────────────────────

  /** Apply integer intensity (0-4 scale). */
  setIntensities(data: Partial<Record<Muscle, number>>, scalePreset: ColorScalePreset = 'workout') {
    const scale = resolveColorScale(scalePreset);
    this.highlights.clear();
    for (const [muscle, level] of Object.entries(data)) {
      const intensity = Math.min(Math.max(level as number, 0), 4) / 4;
      const color = scale.color(intensity);
      this.highlights.set(muscle as Muscle, {
        muscle: muscle as Muscle,
        fill: { type: 'color', color },
        opacity: 1,
      });
    }
    this.draw();
  }

  /** Apply heatmap data (0.0-1.0 intensity) with full configuration support. */
  setHeatmap(data: MuscleIntensity[], config: HeatmapConfig = {}) {
    const scale = resolveColorScale(
      config.colorScale ?? 'workout',
      config.interpolation
    );
    this.highlights.clear();
    for (const entry of data) {
      if (config.threshold !== undefined && entry.intensity < config.threshold) continue;

      // Gradient fill mode (ported from HeatmapConfiguration.swift)
      if (config.gradientFill) {
        const highColor = entry.color ?? scale.color(entry.intensity);
        const lowFactor = config.gradientLowFactor ?? 0.3;
        const lowColor = scale.color(entry.intensity * lowFactor);
        const dir = config.gradientDirection ?? 'topToBottom';
        const [sx, sy, ex, ey] = GRADIENT_DIR_MAP[dir];
        this.highlights.set(entry.muscle, {
          muscle: entry.muscle,
          fill: { type: 'linearGradient', colors: [lowColor, highColor], startX: sx, startY: sy, endX: ex, endY: ey },
          opacity: 1,
        });
      } else {
        const color = entry.color ?? scale.color(entry.intensity);
        this.highlights.set(entry.muscle, {
          muscle: entry.muscle,
          fill: { type: 'color', color },
          opacity: 1,
        });
      }
    }
    this.draw();
  }

  // ─── Public API: Selection ───────────────────────────────────────────────

  /** Programmatically select a muscle. */
  select(muscle: Muscle) {
    if (!this.multiSelect) this.selectedMuscles.clear();
    this.selectedMuscles.add(muscle);
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
  }

  /** Programmatically select multiple muscles. */
  selectMany(muscles: Muscle[]) {
    if (!this.multiSelect) this.selectedMuscles.clear();
    for (const m of muscles) this.selectedMuscles.add(m);
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
  }

  /** Deselect a muscle. */
  deselect(muscle: Muscle) {
    this.selectedMuscles.delete(muscle);
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
  }

  /** Toggle selection on a muscle. */
  toggleSelect(muscle: Muscle) {
    if (this.selectedMuscles.has(muscle)) {
      this.selectedMuscles.delete(muscle);
    } else {
      if (!this.multiSelect) this.selectedMuscles.clear();
      this.selectedMuscles.add(muscle);
    }
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
  }

  /** Clear all selections. */
  clearSelection() {
    this.selectedMuscles.clear();
    this.draw();
    this.emit('selectionChange', []);
  }

  /** Get currently selected muscles. */
  getSelectedMuscles(): Muscle[] {
    return Array.from(this.selectedMuscles);
  }

  /** Check if a muscle is selected. */
  isSelected(muscle: Muscle): boolean {
    return this.selectedMuscles.has(muscle);
  }

  // ─── Public API: Configuration ───────────────────────────────────────────

  setGender(gender: BodyGender) {
    this.gender = gender;
    this.draw();
  }

  setSide(side: BodySide) {
    this.side = side;
    this.draw();
  }

  setStyle(style: StylePreset | BodyViewStyle) {
    this.style = resolveStyle(style);
    this.draw();
  }

  setInteractive(interactive: boolean) {
    this.interactive = interactive;
    if (interactive) {
      this.canvas.addEventListener('pointerdown', this.handlePointerDown);
      this.canvas.addEventListener('pointermove', this.handlePointerMove);
      this.canvas.addEventListener('pointerup', this.handlePointerUp);
      this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
    } else {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvas.removeEventListener('pointermove', this.handlePointerMove);
      this.canvas.removeEventListener('pointerup', this.handlePointerUp);
      this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
      this.canvas.style.cursor = 'default';
    }
  }

  /** Force a redraw. */
  redraw() {
    this.draw();
  }

  /** Get the bounding rect of a muscle in CSS pixel coordinates. */
  getBoundingRect(muscle: Muscle): { x: number; y: number; width: number; height: number } | null {
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    const renderer = this.makeRenderer();
    return renderer.boundingRect(muscle, cssW, cssH);
  }

  // ─── Public API: Selection History (Undo/Redo) ────────────────────────────

  /** Enable selection history tracking. */
  enableHistory(maxEntries = 50) {
    this._historyEnabled = true;
    this._historyMax = maxEntries;
  }

  /** Undo the last selection change. Returns restored muscles or null. */
  undo(): Muscle[] | null {
    if (!this._undoStack.length) return null;
    this._redoStack.push(new Set(this.selectedMuscles));
    const prev = this._undoStack.pop()!;
    this.selectedMuscles = prev;
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
    return this.getSelectedMuscles();
  }

  /** Redo a previously undone selection change. Returns restored muscles or null. */
  redo(): Muscle[] | null {
    if (!this._redoStack.length) return null;
    this._undoStack.push(new Set(this.selectedMuscles));
    const next = this._redoStack.pop()!;
    this.selectedMuscles = next;
    this.draw();
    this.emit('selectionChange', this.getSelectedMuscles());
    return this.getSelectedMuscles();
  }

  get canUndo(): boolean { return this._undoStack.length > 0; }
  get canRedo(): boolean { return this._redoStack.length > 0; }

  // ─── Public API: Tooltip ──────────────────────────────────────────────────

  /** Enable tooltip overlay. Renderer receives muscle & side, returns HTML string. */
  enableTooltip(renderer?: (muscle: Muscle, side: MuscleSide) => string) {
    this._tooltipEnabled = true;
    this._tooltipRenderer = renderer ?? ((m) => MUSCLE_DISPLAY_NAMES[m] ?? m);
    if (!this._tooltipEl) {
      this._tooltipEl = document.createElement('div');
      this._tooltipEl.className = 'mm-tooltip';
      this._tooltipEl.style.cssText = `
        position:absolute;pointer-events:none;z-index:10;
        background:rgba(0,0,0,0.85);color:#fff;padding:6px 12px;
        border-radius:6px;font-size:13px;font-family:system-ui,sans-serif;
        white-space:nowrap;opacity:0;transition:opacity 150ms ease;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
      `;
      this.container.style.position = this.container.style.position || 'relative';
      this.container.appendChild(this._tooltipEl);
    }
  }

  /** Disable and remove tooltip overlay. */
  disableTooltip() {
    this._tooltipEnabled = false;
    this._tooltipEl?.remove();
    this._tooltipEl = null;
  }

  // ─── Public API: Animation ────────────────────────────────────────────────

  /** Enable smooth highlight transition animations. */
  enableAnimation(duration = 300) {
    this._animated = true;
    this._animDuration = duration;
  }

  /** Disable animations. */
  disableAnimation() {
    this._animated = false;
    if (this._animRAF) cancelAnimationFrame(this._animRAF);
  }

  // ─── Public API: Pulse ────────────────────────────────────────────────────

  /** Enable pulse animation on selected muscles. Ported from PulseBodyView.swift. */
  enablePulse(speed = 1.5, min = 0.6, max = 1.0) {
    this._pulseEnabled = true;
    this._pulseSpeed = speed;
    this._pulseMin = min;
    this._pulseMax = max;
    this.startPulseLoop();
  }

  /** Disable pulse animation. */
  disablePulse() {
    this._pulseEnabled = false;
    if (this._pulseRAF) cancelAnimationFrame(this._pulseRAF);
    this.draw();
  }

  // ─── Public API: Gesture Configuration ────────────────────────────────────

  /** Set long-press duration in milliseconds (default 500ms). */
  setLongPressDuration(ms: number) {
    this._longPressDuration = ms;
  }

  // ─── Public API: Events ──────────────────────────────────────────────────

  on(event: 'muscleClick', handler: (muscle: Muscle, side: MuscleSide) => void): void;
  on(event: 'muscleEnter', handler: (muscle: Muscle, side: MuscleSide) => void): void;
  on(event: 'muscleLeave', handler: () => void): void;
  on(event: 'selectionChange', handler: (muscles: Muscle[]) => void): void;
  on(event: 'muscleLongPress', handler: (muscle: Muscle, side: MuscleSide) => void): void;
  on(event: 'muscleDrag', handler: (muscle: Muscle, side: MuscleSide) => void): void;
  on(event: 'muscleDragEnd', handler: () => void): void;
  on(event: EventType | string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event as EventType)) {
      this.eventHandlers.set(event as EventType, new Set());
    }
    this.eventHandlers.get(event as EventType)!.add(handler);
  }

  off(event: EventType | string, handler: EventHandler) {
    this.eventHandlers.get(event as EventType)?.delete(handler);
  }

  // ─── Public API: Lifecycle ───────────────────────────────────────────────

  destroy() {
    this.destroyed = true;
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    if (this._pulseRAF) cancelAnimationFrame(this._pulseRAF);
    if (this._animRAF) cancelAnimationFrame(this._animRAF);
    this._tooltipEl?.remove();
    this.resizeObserver?.disconnect();
    this.canvas.remove();
    this.eventHandlers.clear();
  }

  // ─── Internal: Rendering ─────────────────────────────────────────────────

  private makeRenderer(highlightOverride?: Map<Muscle, MuscleHighlight>): BodyRenderer {
    return new BodyRenderer(
      this.gender,
      this.side,
      highlightOverride ?? this.highlights,
      this.style,
      this.selectedMuscles,
      this.hideSubGroups,
    );
  }

  private draw() {
    if (this.destroyed) return;
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const renderer = this.makeRenderer();
    renderer.render(this.ctx, cssW, cssH, this.dpr);
  }

  /** Animated draw: cross-fade from previous to current highlights. */
  private drawAnimated() {
    if (!this._animated || this._animProgress >= 1) {
      this.draw();
      return;
    }

    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Blend highlights
    const blended = this.blendHighlights(this._animProgress);
    const renderer = this.makeRenderer(blended);
    renderer.render(this.ctx, cssW, cssH, this.dpr);
  }

  /** Blend previous and current highlights for animation. Ported from AnimatedBodyContainer.swift. */
  private blendHighlights(progress: number): Map<Muscle, MuscleHighlight> {
    if (progress >= 1) return this.highlights;
    const result = new Map<Muscle, MuscleHighlight>();
    const allMuscles = new Set([...this._prevHighlights.keys(), ...this.highlights.keys()]);

    for (const muscle of allMuscles) {
      const prev = this._prevHighlights.get(muscle);
      const curr = this.highlights.get(muscle);

      if (!prev && curr) {
        // Fade in
        result.set(muscle, { ...curr, opacity: curr.opacity * progress });
      } else if (prev && !curr) {
        // Fade out
        result.set(muscle, { ...prev, opacity: prev.opacity * (1 - progress) });
      } else if (prev && curr) {
        // Cross-fade color + opacity
        const blendedOpacity = prev.opacity + (curr.opacity - prev.opacity) * progress;
        let blendedFill: MuscleFill;
        if (prev.fill.type === 'color' && curr.fill.type === 'color') {
          blendedFill = { type: 'color', color: interpolateCSS(prev.fill.color, curr.fill.color, progress) };
        } else {
          blendedFill = progress < 0.5 ? prev.fill : curr.fill;
        }
        result.set(muscle, { muscle, fill: blendedFill, opacity: blendedOpacity });
      }
    }
    return result;
  }

  /** Start animation loop for highlight transitions. */
  private startAnimationLoop() {
    this._animStartTime = performance.now();
    this._animProgress = 0;

    const tick = (now: number) => {
      const elapsed = now - this._animStartTime;
      this._animProgress = Math.min(1, elapsed / this._animDuration);
      // easeInOut curve
      const t = this._animProgress;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      this._animProgress = eased;

      this.drawAnimated();

      if (eased < 1 && !this.destroyed) {
        this._animRAF = requestAnimationFrame(tick);
      }
    };
    this._animRAF = requestAnimationFrame(tick);
  }

  /** Start pulse loop. Ported from PulseBodyCanvas.swift. */
  private startPulseLoop() {
    const tick = () => {
      if (!this._pulseEnabled || this.destroyed || this.selectedMuscles.size === 0) {
        this._pulseRAF = 0;
        return;
      }

      const elapsed = performance.now() / 1000;
      const phase = (Math.sin(elapsed * this._pulseSpeed * Math.PI * 2) + 1) / 2;
      const pulseFactor = this._pulseMin + phase * (this._pulseMax - this._pulseMin);

      // Draw with pulse (modify selection stroke alpha)
      const cssW = this.canvas.width / this.dpr;
      const cssH = this.canvas.height / this.dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Create a modified style with pulsed selection opacity
      const pulsedHighlights = new Map(this.highlights);
      for (const muscle of this.selectedMuscles) {
        const existing = pulsedHighlights.get(muscle);
        if (existing) {
          pulsedHighlights.set(muscle, { ...existing, opacity: existing.opacity * pulseFactor });
        }
      }

      const renderer = this.makeRenderer(pulsedHighlights);
      renderer.render(this.ctx, cssW, cssH, this.dpr);

      this._pulseRAF = requestAnimationFrame(tick);
    };
    this._pulseRAF = requestAnimationFrame(tick);
  }

  /** Trigger draw with optional animation. */
  private drawWithAnimation() {
    if (this._animated && this._prevHighlights.size > 0) {
      this.startAnimationLoop();
    } else {
      this.draw();
    }
  }

  /** Push to selection history before a selection change. */
  private pushHistory() {
    if (!this._historyEnabled) return;
    this._undoStack.push(new Set(this.selectedMuscles));
    if (this._undoStack.length > this._historyMax) this._undoStack.shift();
    this._redoStack = [];
  }

  private resize() {
    if (this.destroyed) return;
    const rect = this.container.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.draw();
  }

  // ─── Internal: Event Handling ────────────────────────────────────────────

  /** Unified pointer down: starts long press timer + prepares drag. */
  private handlePointerDown = (e: PointerEvent) => {
    const { x, y } = this.canvasCoords(e);
    this._isDragging = false;
    this._lastDragMuscle = null;

    // Start long press timer
    clearTimeout(this._longPressTimer);
    this._longPressTimer = window.setTimeout(() => {
      const hit = this.doHitTest(x, y);
      if (hit) {
        this.emit('muscleLongPress' as EventType, hit.muscle, hit.side);
      }
    }, this._longPressDuration);
  };

  /** Pointer move: hover detection + drag-to-select. */
  private handlePointerMove = (e: PointerEvent) => {
    const { x, y } = this.canvasCoords(e);

    // Cancel long press if moved too much
    if (e.buttons > 0) {
      clearTimeout(this._longPressTimer);
      this._isDragging = true;

      // Drag-to-select
      const hit = this.doHitTest(x, y);
      if (hit && hit.muscle !== this._lastDragMuscle) {
        this._lastDragMuscle = hit.muscle;
        this.emit('muscleDrag' as EventType, hit.muscle, hit.side);
      }
      return;
    }

    // Hover
    const hit = this.doHitTest(x, y);
    if (hit) {
      if (this.hoveredMuscle !== hit.muscle) {
        this.hoveredMuscle = hit.muscle;
        this.canvas.style.cursor = 'pointer';
        this.canvas.title = MUSCLE_DISPLAY_NAMES[hit.muscle] ?? hit.muscle;
        this.emit('muscleEnter', hit.muscle, hit.side);

        // Update tooltip position
        this.updateTooltip(hit.muscle, hit.side);
      }
    } else if (this.hoveredMuscle) {
      this.hoveredMuscle = null;
      this.canvas.style.cursor = 'default';
      this.canvas.title = '';
      this.hideTooltip();
      this.emit('muscleLeave');
    }
  };

  /** Pointer up: fire click if not a drag, clean up. */
  private handlePointerUp = (e: PointerEvent) => {
    clearTimeout(this._longPressTimer);

    if (this._isDragging) {
      this._isDragging = false;
      this.emit('muscleDragEnd' as EventType);
      return;
    }

    // Treat as click
    const { x, y } = this.canvasCoords(e);
    const hit = this.doHitTest(x, y);
    if (hit) {
      this.pushHistory();
      this.toggleSelect(hit.muscle);

      if (this.selectedMuscles.has(hit.muscle)) {
        this.highlights.set(hit.muscle, {
          muscle: hit.muscle,
          fill: { type: 'color', color: this.style.selectionColor },
          opacity: 1,
        });
      } else {
        this.highlights.delete(hit.muscle);
      }

      this.draw();
      this.emit('muscleClick', hit.muscle, hit.side);

      // Restart pulse if enabled
      if (this._pulseEnabled && !this._pulseRAF) this.startPulseLoop();
    }
  };

  private handlePointerLeave = () => {
    clearTimeout(this._longPressTimer);
    if (this._isDragging) {
      this._isDragging = false;
      this.emit('muscleDragEnd' as EventType);
    }
    if (this.hoveredMuscle) {
      this.hoveredMuscle = null;
      this.canvas.style.cursor = 'default';
      this.canvas.title = '';
      this.hideTooltip();
      this.emit('muscleLeave');
    }
  };

  /** Centralized hit test helper. */
  private doHitTest(x: number, y: number) {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    return this.makeRenderer().hitTest(this.ctx, x, y, w, h);
  }

  // ─── Internal: Tooltip ───────────────────────────────────────────────────

  private updateTooltip(muscle: Muscle, side: MuscleSide) {
    if (!this._tooltipEnabled || !this._tooltipEl || !this._tooltipRenderer) return;

    this._tooltipEl.innerHTML = this._tooltipRenderer(muscle, side);
    this._tooltipEl.style.opacity = '1';

    // Position above the muscle bounding rect
    const rect = this.getBoundingRect(muscle);
    if (rect) {
      const tooltipH = this._tooltipEl.offsetHeight || 30;
      const padding = 8;
      let top = rect.y - tooltipH - padding;
      if (top < 0) top = rect.y + rect.height + padding;
      let left = rect.x + rect.width / 2 - (this._tooltipEl.offsetWidth || 60) / 2;
      left = Math.max(4, Math.min(left, this.container.clientWidth - (this._tooltipEl.offsetWidth || 60) - 4));

      this._tooltipEl.style.top = `${top}px`;
      this._tooltipEl.style.left = `${left}px`;
    }
  }

  private hideTooltip() {
    if (this._tooltipEl) this._tooltipEl.style.opacity = '0';
  }

  private canvasCoords(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private emit(event: EventType | string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event as EventType);
    if (handlers) {
      for (const h of handlers) h(...args);
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps GradientDirection to [startX, startY, endX, endY] unit points. */
const GRADIENT_DIR_MAP: Record<GradientDirection, [number, number, number, number]> = {
  topToBottom: [0.5, 0, 0.5, 1],
  bottomToTop: [0.5, 1, 0.5, 0],
  leftToRight: [0, 0.5, 1, 0.5],
  rightToLeft: [1, 0.5, 0, 0.5],
};
