/**
 * MuscleMapJS — Styles & Presets
 * Ported from BodyViewStyle.swift
 */
import type { BodyViewStyle, StylePreset } from '../types';
import { MM_DEFAULT_FILL, MM_LIGHTER_FILL, MM_MEDIUM_FILL } from '../utils/color';

/** Default style: gray fill, green selection. */
export const STYLE_DEFAULT: BodyViewStyle = {
  defaultFillColor: MM_DEFAULT_FILL,
  strokeColor: 'transparent',
  strokeWidth: 0,
  selectionColor: '#00c853',
  selectionStrokeColor: '#00c853',
  selectionStrokeWidth: 2,
  headColor: 'rgb(191,191,191)',
  hairColor: 'rgb(64,64,64)',
  shadowColor: 'transparent',
  shadowRadius: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
};

/** Minimal style: subtle fill, thin strokes. */
export const STYLE_MINIMAL: BodyViewStyle = {
  ...STYLE_DEFAULT,
  defaultFillColor: MM_LIGHTER_FILL,
  strokeColor: MM_MEDIUM_FILL,
  strokeWidth: 0.5,
  selectionStrokeWidth: 1.5,
};

/** Neon style: dark background, cyan glow. */
export const STYLE_NEON: BodyViewStyle = {
  ...STYLE_DEFAULT,
  defaultFillColor: 'rgb(38,38,38)',
  strokeColor: 'rgb(77,77,77)',
  strokeWidth: 0.5,
  selectionColor: '#00e5ff',
  selectionStrokeColor: '#00e5ff',
  selectionStrokeWidth: 2,
  headColor: 'rgb(51,51,51)',
  hairColor: 'rgb(26,26,26)',
  shadowColor: 'rgba(0,229,255,0.6)',
  shadowRadius: 8,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
};

/** Medical/clinical style. */
export const STYLE_MEDICAL: BodyViewStyle = {
  ...STYLE_DEFAULT,
  defaultFillColor: 'rgb(230,235,242)',
  strokeColor: 'rgb(179,191,204)',
  strokeWidth: 0.5,
  selectionColor: '#2979ff',
  selectionStrokeColor: '#2979ff',
  selectionStrokeWidth: 2,
  headColor: 'rgb(217,222,230)',
  hairColor: 'rgb(77,82,89)',
};

/** Map of preset names to style objects. */
export const STYLE_PRESETS: Record<StylePreset, BodyViewStyle> = {
  default: STYLE_DEFAULT,
  minimal: STYLE_MINIMAL,
  neon: STYLE_NEON,
  medical: STYLE_MEDICAL,
};

/** Resolve a style from a preset name or custom object. */
export function resolveStyle(style: StylePreset | BodyViewStyle): BodyViewStyle {
  if (typeof style === 'string') {
    return STYLE_PRESETS[style] ?? STYLE_DEFAULT;
  }
  return style;
}
