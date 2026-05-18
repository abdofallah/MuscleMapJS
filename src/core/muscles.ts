/**
 * MuscleMapJS — Muscle definitions, sub-groups, and lookups.
 * Ported from Muscle.swift
 */
import type { Muscle, BodySlug } from '../types';

/** All 22 base muscle identifiers. */
export const BASE_MUSCLES: readonly Muscle[] = [
  'abs', 'biceps', 'calves', 'chest', 'deltoids', 'feet', 'forearm',
  'gluteal', 'hamstring', 'hands', 'head', 'knees', 'lower-back',
  'obliques', 'quadriceps', 'tibialis', 'trapezius', 'triceps',
  'upper-back', 'rotator-cuff', 'serratus', 'rhomboids',
] as const;

/** All 14 sub-group identifiers. */
export const SUB_GROUP_MUSCLES: readonly Muscle[] = [
  'ankles', 'adductors', 'neck', 'hip-flexors',
  'upper-chest', 'lower-chest', 'inner-quad', 'outer-quad',
  'upper-abs', 'lower-abs', 'front-deltoid', 'rear-deltoid',
  'upper-trapezius', 'lower-trapezius',
] as const;

/** All 36 muscles combined. */
export const ALL_MUSCLES: readonly Muscle[] = [...BASE_MUSCLES, ...SUB_GROUP_MUSCLES] as const;

/** Parent → children sub-group mapping. */
const SUB_GROUP_MAP: Partial<Record<Muscle, Muscle[]>> = {
  'chest': ['upper-chest', 'lower-chest'],
  'quadriceps': ['inner-quad', 'outer-quad', 'hip-flexors'],
  'abs': ['upper-abs', 'lower-abs'],
  'deltoids': ['front-deltoid', 'rear-deltoid'],
  'trapezius': ['upper-trapezius', 'lower-trapezius'],
  'obliques': ['serratus'],
  'feet': ['ankles'],
  'hamstring': ['adductors'],
  'head': ['neck'],
};

/** Child → parent mapping (inverse of SUB_GROUP_MAP). */
const PARENT_MAP: Partial<Record<Muscle, Muscle>> = {};
for (const [parent, children] of Object.entries(SUB_GROUP_MAP)) {
  if (!children) continue;
  for (const child of children) {
    PARENT_MAP[child as Muscle] = parent as Muscle;
  }
}

/** Get sub-groups of a muscle. Returns empty array if none. */
export function getSubGroups(muscle: Muscle): Muscle[] {
  return SUB_GROUP_MAP[muscle] ?? [];
}

/** Get the parent muscle of a sub-group. Returns undefined if not a sub-group. */
export function getParentGroup(muscle: Muscle): Muscle | undefined {
  return PARENT_MAP[muscle];
}

/** Whether this muscle is a sub-group. */
export function isSubGroup(muscle: Muscle): boolean {
  return PARENT_MAP[muscle] !== undefined;
}

/** Whether this is a cosmetic part (head/hair). */
export function isCosmeticPart(muscle: Muscle): boolean {
  return muscle === 'head';
}

/** Always-visible sub-groups that render by default but return parent on tap. */
const ALWAYS_VISIBLE: Set<Muscle> = new Set(['ankles', 'adductors', 'neck']);

export function isAlwaysVisibleSubGroup(muscle: Muscle): boolean {
  return ALWAYS_VISIBLE.has(muscle);
}

/** Convert a BodySlug to a Muscle (returns undefined for 'hair'). */
export function slugToMuscle(slug: BodySlug): Muscle | undefined {
  if (slug === 'hair') return undefined;
  return slug as Muscle;
}

/** English display names for muscles. */
export const MUSCLE_DISPLAY_NAMES: Record<Muscle, string> = {
  'abs': 'Abs',
  'biceps': 'Biceps',
  'calves': 'Calves',
  'chest': 'Chest',
  'deltoids': 'Deltoids',
  'feet': 'Feet',
  'forearm': 'Forearm',
  'gluteal': 'Gluteal',
  'hamstring': 'Hamstring',
  'hands': 'Hands',
  'head': 'Head',
  'knees': 'Knees',
  'lower-back': 'Lower Back',
  'obliques': 'Obliques',
  'quadriceps': 'Quadriceps',
  'tibialis': 'Tibialis',
  'trapezius': 'Trapezius',
  'triceps': 'Triceps',
  'upper-back': 'Upper Back',
  'rotator-cuff': 'Rotator Cuff',
  'serratus': 'Serratus',
  'rhomboids': 'Rhomboids',
  'ankles': 'Ankles',
  'adductors': 'Adductors',
  'neck': 'Neck',
  'hip-flexors': 'Hip Flexors',
  'upper-chest': 'Upper Chest',
  'lower-chest': 'Lower Chest',
  'inner-quad': 'Inner Quad',
  'outer-quad': 'Outer Quad',
  'upper-abs': 'Upper Abs',
  'lower-abs': 'Lower Abs',
  'front-deltoid': 'Front Deltoid',
  'rear-deltoid': 'Rear Deltoid',
  'upper-trapezius': 'Upper Trapezius',
  'lower-trapezius': 'Lower Trapezius',
};
