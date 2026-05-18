/**
 * MuscleMapJS — Heatmap Legend Component
 * Ported from HeatmapLegendView.swift
 * 
 * Creates a standalone color bar legend for heatmap visualization.
 * Can be horizontal or vertical, with configurable labels and step count.
 */
import type { ColorInterpolation, ColorScalePreset } from '../types';
import { HeatmapColorScale, resolveColorScale } from '../heatmap/color-scale';
import { applyInterpolation } from '../heatmap/color-interpolation';

export interface HeatmapLegendOptions {
  /** Color scale preset name or HeatmapColorScale instance. */
  colorScale: ColorScalePreset | HeatmapColorScale;
  /** Interpolation curve for the color bar (default: linear). */
  interpolation?: ColorInterpolation;
  /** 'horizontal' or 'vertical' (default: horizontal). */
  orientation?: 'horizontal' | 'vertical';
  /** Thickness of the color bar in pixels (default: 16). */
  barThickness?: number;
  /** Label for low end (default: 'Low'). */
  labelMin?: string;
  /** Label for high end (default: 'High'). */
  labelMax?: string;
  /** Number of color steps to render (default: 32). */
  steps?: number;
}

export class HeatmapLegend {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private labelMinEl: HTMLElement;
  private labelMaxEl: HTMLElement;

  private scale: HeatmapColorScale;
  private interpolation: ColorInterpolation;
  private orientation: 'horizontal' | 'vertical';
  private barThickness: number;
  private steps: number;

  constructor(container: HTMLElement, options: HeatmapLegendOptions) {
    this.container = container;
    this.orientation = options.orientation ?? 'horizontal';
    this.barThickness = options.barThickness ?? 16;
    this.steps = Math.max(options.steps ?? 32, 2);
    this.interpolation = options.interpolation ?? { type: 'linear' };

    // Resolve color scale
    if (options.colorScale instanceof HeatmapColorScale) {
      this.scale = options.colorScale;
    } else {
      this.scale = resolveColorScale(options.colorScale);
    }

    // Build DOM
    const wrapper = document.createElement('div');
    wrapper.className = 'mm-legend';
    wrapper.style.cssText = `display:flex;gap:4px;align-items:stretch;font-family:system-ui,sans-serif;`;
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', 'Heatmap intensity legend');

    if (this.orientation === 'horizontal') {
      wrapper.style.flexDirection = 'column';
    } else {
      wrapper.style.flexDirection = 'row';
    }

    // Canvas for color bar
    this.canvas = document.createElement('canvas');
    this.canvas.style.borderRadius = `${this.barThickness / 4}px`;
    this.canvas.style.display = 'block';
    this.ctx = this.canvas.getContext('2d')!;

    // Labels
    this.labelMinEl = document.createElement('span');
    this.labelMinEl.textContent = options.labelMin ?? 'Low';
    this.labelMinEl.style.cssText = 'font-size:11px;color:#888;';

    this.labelMaxEl = document.createElement('span');
    this.labelMaxEl.textContent = options.labelMax ?? 'High';
    this.labelMaxEl.style.cssText = 'font-size:11px;color:#888;';

    if (this.orientation === 'horizontal') {
      wrapper.appendChild(this.canvas);
      const labelsRow = document.createElement('div');
      labelsRow.style.cssText = 'display:flex;justify-content:space-between;';
      labelsRow.appendChild(this.labelMinEl);
      labelsRow.appendChild(this.labelMaxEl);
      wrapper.appendChild(labelsRow);
    } else {
      const labelsCol = document.createElement('div');
      labelsCol.style.cssText = 'display:flex;flex-direction:column;justify-content:space-between;';
      labelsCol.appendChild(this.labelMaxEl);
      labelsCol.appendChild(this.labelMinEl);
      wrapper.appendChild(labelsCol);
      wrapper.appendChild(this.canvas);
    }

    container.appendChild(wrapper);

    // Draw
    this.resize();
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(container);
  }

  /** Update the color scale. */
  setColorScale(scale: ColorScalePreset | HeatmapColorScale) {
    if (scale instanceof HeatmapColorScale) {
      this.scale = scale;
    } else {
      this.scale = resolveColorScale(scale);
    }
    this.draw();
  }

  /** Update interpolation. */
  setInterpolation(interp: ColorInterpolation) {
    this.interpolation = interp;
    this.draw();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.container.getBoundingClientRect();

    if (this.orientation === 'horizontal') {
      this.canvas.style.width = '100%';
      this.canvas.style.height = `${this.barThickness}px`;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = this.barThickness * dpr;
    } else {
      this.canvas.style.width = `${this.barThickness}px`;
      this.canvas.style.height = '100%';
      this.canvas.width = this.barThickness * dpr;
      this.canvas.height = rect.height * dpr;
    }

    this.draw();
  }

  private draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const count = this.steps;
    const isHorizontal = this.orientation === 'horizontal';

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const curved = applyInterpolation(this.interpolation, t);
      const color = this.scale.color(curved);

      this.ctx.fillStyle = color;

      if (isHorizontal) {
        const stepW = w / count;
        this.ctx.fillRect(i * stepW, 0, stepW + 1, h);
      } else {
        const stepH = h / count;
        const invertedI = count - 1 - i;
        this.ctx.fillRect(0, invertedI * stepH, w, stepH + 1);
      }
    }
  }
}
