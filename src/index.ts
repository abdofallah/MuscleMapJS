/**
 * MuscleMapJS — Public API Entry Point
 * 
 * Import everything from this file:
 *   import { MuscleMapWidget, ALL_MUSCLES, ... } from './MuscleMapJS/src/index';
 */

// Main widget
export { MuscleMapWidget } from './widget/muscle-map-widget';

// Heatmap legend component
export { HeatmapLegend } from './widget/heatmap-legend';
export type { HeatmapLegendOptions } from './widget/heatmap-legend';

// Types
export type {
  Muscle, BodySlug, MuscleSide, BodySide, BodyGender,
  BodyPartPathData, BodyViewBox, RGBA,
  MuscleFill, MuscleHighlight, MuscleIntensity,
  ColorInterpolation, GradientDirection, ColorScalePreset,
  HeatmapConfig, StylePreset, BodyViewStyle,
  MuscleMapOptions, MuscleEvent,
} from './types';

// Muscle helpers
export {
  ALL_MUSCLES, BASE_MUSCLES, SUB_GROUP_MUSCLES,
  MUSCLE_DISPLAY_NAMES,
  getSubGroups, getParentGroup, isSubGroup,
  isCosmeticPart, isAlwaysVisibleSubGroup,
} from './core/muscles';

// Style presets
export {
  STYLE_DEFAULT, STYLE_MINIMAL, STYLE_NEON, STYLE_MEDICAL,
  STYLE_PRESETS, resolveStyle,
} from './styles/body-view-style';

// Heatmap
export { HeatmapColorScale, COLOR_SCALE_PRESETS, resolveColorScale } from './heatmap/color-scale';
export { applyInterpolation } from './heatmap/color-interpolation';

// Color utilities
export { parseColor, toCSSColor, interpolateColor, interpolateCSS } from './utils/color';

// i18n
export {
  setLocale, getLocale, getAvailableLocales,
  getMuscleName, getAllMuscleNames, getUIString,
} from './i18n/locales';
export type { Locale } from './i18n/locales';
