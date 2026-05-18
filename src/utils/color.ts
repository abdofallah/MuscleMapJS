/**
 * MuscleMapJS — Color Utilities
 * Ported from Color+Extensions.swift
 */
import type { RGBA } from '../types';

/** Parse a CSS color string to RGBA (0-1 range). Uses a hidden canvas for parsing. */
let _parseCtx: CanvasRenderingContext2D | null = null;

function getParseCtx(): CanvasRenderingContext2D {
  if (!_parseCtx) {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    _parseCtx = c.getContext('2d')!;
  }
  return _parseCtx;
}

export function parseColor(css: string): RGBA {
  const ctx = getParseCtx();
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return { r: d[0] / 255, g: d[1] / 255, b: d[2] / 255, a: d[3] / 255 };
}

/** Convert RGBA to CSS rgba() string. */
export function toCSSColor(c: RGBA): string {
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${c.a.toFixed(3)})`;
}

/** Linearly interpolate between two RGBA colors. */
export function interpolateColor(from: RGBA, to: RGBA, t: number): RGBA {
  const f = Math.max(0, Math.min(1, t));
  return {
    r: from.r + (to.r - from.r) * f,
    g: from.g + (to.g - from.g) * f,
    b: from.b + (to.b - from.b) * f,
    a: from.a + (to.a - from.a) * f,
  };
}

/** Interpolate two CSS color strings. */
export function interpolateCSS(fromCSS: string, toCSS: string, t: number): string {
  return toCSSColor(interpolateColor(parseColor(fromCSS), parseColor(toCSS), t));
}

// ─── Preset Colors (match Swift mmDefaultFill etc.) ──────────────────────────

export const MM_DEFAULT_FILL = 'rgb(199,199,199)';   // Color(white: 0.78)
export const MM_LIGHT_FILL = 'rgb(217,217,217)';     // Color(white: 0.85)
export const MM_LIGHTER_FILL = 'rgb(224,224,224)';    // Color(white: 0.88)
export const MM_MEDIUM_FILL = 'rgb(179,179,179)';     // Color(white: 0.7)

// ─── Math Helpers ────────────────────────────────────────────────────────────

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
