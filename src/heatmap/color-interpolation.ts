/**
 * MuscleMapJS — Color Interpolation Functions
 * Ported from ColorInterpolation.swift
 */
import type { ColorInterpolation } from '../types';

/** Apply an interpolation curve to a 0.0-1.0 value. */
export function applyInterpolation(interp: ColorInterpolation, t: number): number {
  const c = Math.max(0, Math.min(1, t));
  switch (interp.type) {
    case 'linear': return c;
    case 'easeIn': return c * c;
    case 'easeOut': return 1 - (1 - c) * (1 - c);
    case 'easeInOut':
      return c < 0.5
        ? 2 * c * c
        : 1 - Math.pow(-2 * c + 2, 2) / 2;
    case 'step': {
      if (interp.count <= 0) return c;
      const stepped = Math.floor(c * interp.count) / interp.count;
      return Math.min(stepped, 1);
    }
    case 'custom': {
      return Math.max(0, Math.min(1, interp.fn(c)));
    }
  }
}
