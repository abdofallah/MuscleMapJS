/**
 * MuscleMapJS — Body Path Data Provider
 * Ported from BodyPathData.swift
 */
import type { BodyGender, BodySide, BodyPartPathData, BodyViewBox } from '../types';
import { maleFrontPaths } from '../data/male-front-paths';
import { maleBackPaths } from '../data/male-back-paths';
import { femaleFrontPaths } from '../data/female-front-paths';
import { femaleBackPaths } from '../data/female-back-paths';

// ─── ViewBox Definitions ─────────────────────────────────────────────────────

const VIEW_BOXES: Record<string, BodyViewBox> = {
  'male-front':   { originX: 0,   originY: 95,  width: 727,  height: 1280 },
  'male-back':    { originX: 718, originY: 95,  width: 727,  height: 1280 },
  'female-front': { originX: 0,   originY: 0,   width: 650,  height: 1450 },
  'female-back':  { originX: 823, originY: 0,   width: 650,  height: 1450 },
};

/** Get the body parts path data for a given gender and side. */
export function getBodyPaths(gender: BodyGender, side: BodySide): BodyPartPathData[] {
  const key = `${gender}-${side}`;
  switch (key) {
    case 'male-front':   return maleFrontPaths;
    case 'male-back':    return maleBackPaths;
    case 'female-front': return femaleFrontPaths;
    case 'female-back':  return femaleBackPaths;
    default:             return maleFrontPaths;
  }
}

/** Get the viewBox for a given gender and side. */
export function getViewBox(gender: BodyGender, side: BodySide): BodyViewBox {
  return VIEW_BOXES[`${gender}-${side}`] ?? VIEW_BOXES['male-front'];
}
