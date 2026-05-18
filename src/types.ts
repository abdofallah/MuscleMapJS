/**
 * MuscleMapJS — Core Type Definitions
 * Ported from MuscleMap SwiftUI SDK by Melih Colpan.
 * Licensed under the MIT License.
 */

// ─── Enums (String Literal Unions) ───────────────────────────────────────────

/** All 36 muscle identifiers (22 base + 14 sub-groups). */
export type Muscle =
  | 'abs' | 'biceps' | 'calves' | 'chest' | 'deltoids'
  | 'feet' | 'forearm' | 'gluteal' | 'hamstring' | 'hands'
  | 'head' | 'knees' | 'lower-back' | 'obliques' | 'quadriceps'
  | 'tibialis' | 'trapezius' | 'triceps' | 'upper-back'
  | 'rotator-cuff' | 'serratus' | 'rhomboids'
  // Sub-groups
  | 'ankles' | 'adductors' | 'neck' | 'hip-flexors'
  | 'upper-chest' | 'lower-chest' | 'inner-quad' | 'outer-quad'
  | 'upper-abs' | 'lower-abs' | 'front-deltoid' | 'rear-deltoid'
  | 'upper-trapezius' | 'lower-trapezius';

/** Internal slug that includes 'hair' for rendering. */
export type BodySlug = Muscle | 'hair';

/** Which side of the body a muscle path belongs to. */
export type MuscleSide = 'left' | 'right' | 'both';

/** Which face of the body to display. */
export type BodySide = 'front' | 'back';

/** The body gender model. */
export type BodyGender = 'male' | 'female';

// ─── Data Structures ─────────────────────────────────────────────────────────

/** SVG path data for a single body part. */
export interface BodyPartPathData {
  slug: BodySlug;
  common: string[];
  left: string[];
  right: string[];
}

/** ViewBox configuration for body rendering. */
export interface BodyViewBox {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

// ─── Color & Fill ────────────────────────────────────────────────────────────

/** Internal RGBA representation (0-1 floats). */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** How a muscle region should be filled. */
export type MuscleFill =
  | { type: 'color'; color: string }
  | { type: 'linearGradient'; colors: string[]; startX: number; startY: number; endX: number; endY: number }
  | { type: 'radialGradient'; colors: string[]; centerX: number; centerY: number; startRadius: number; endRadius: number };

/** A highlighted muscle with color/fill and opacity. */
export interface MuscleHighlight {
  muscle: Muscle;
  fill: MuscleFill;
  opacity: number;
}

/** Intensity data for a specific muscle (0.0-1.0). */
export interface MuscleIntensity {
  muscle: Muscle;
  intensity: number;
  side?: MuscleSide;
  color?: string;
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

/** Color interpolation mode. */
export type ColorInterpolation =
  | { type: 'linear' }
  | { type: 'easeIn' }
  | { type: 'easeOut' }
  | { type: 'easeInOut' }
  | { type: 'step'; count: number }
  | { type: 'custom'; fn: (t: number) => number };

/** Gradient direction for intra-muscle heatmap fills. */
export type GradientDirection = 'topToBottom' | 'bottomToTop' | 'leftToRight' | 'rightToLeft';

/** Named color scale presets. */
export type ColorScalePreset = 'workout' | 'thermal' | 'medical' | 'monochrome' | 'workoutStepped' | 'thermalSmooth';

/** Full heatmap configuration. */
export interface HeatmapConfig {
  colorScale?: ColorScalePreset | string[];
  interpolation?: ColorInterpolation;
  threshold?: number;
  gradientFill?: boolean;
  gradientDirection?: GradientDirection;
  gradientLowFactor?: number;
}

// ─── Style ───────────────────────────────────────────────────────────────────

/** Named style presets. */
export type StylePreset = 'default' | 'minimal' | 'neon' | 'medical';

/** Visual style configuration for body rendering. */
export interface BodyViewStyle {
  defaultFillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectionColor: string;
  selectionStrokeColor: string;
  selectionStrokeWidth: number;
  headColor: string;
  hairColor: string;
  shadowColor: string;
  shadowRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

// ─── Widget Options ──────────────────────────────────────────────────────────

/** Configuration options for the MuscleMapWidget. */
export interface MuscleMapOptions {
  gender?: BodyGender;
  side?: BodySide;
  style?: StylePreset | BodyViewStyle;
  interactive?: boolean;
  multiSelect?: boolean;
  locale?: string;
  animated?: boolean;
  animationDuration?: number;
  showSubGroups?: boolean;
  onMuscleClick?: (muscle: Muscle, side: MuscleSide) => void;
  onMuscleEnter?: (muscle: Muscle, side: MuscleSide) => void;
  onMuscleLeave?: () => void;
  onSelectionChange?: (muscles: Muscle[]) => void;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface MuscleEvent {
  muscle: Muscle;
  side: MuscleSide;
}
