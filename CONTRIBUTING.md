# Contributing to MuscleMapJS

Thank you for considering contributing! This guide will get you set up quickly.

## Getting Started

```bash
git clone https://github.com/abdofallah/MuscleMapJS.git
cd MuscleMapJS
npm install
npm run dev          # starts Vite dev server at http://localhost:5173/demo/index.html
npm run typecheck    # run TypeScript type check
```

## Project Structure

```
src/
  index.ts              ← Public API exports
  types.ts              ← All TypeScript interfaces and type unions
  core/
    body-renderer.ts    ← Canvas2D rendering engine + hit-testing
    body-path-data.ts   ← Path data provider + ViewBox configs
    muscles.ts          ← Muscle hierarchy, sub-groups, display names
  data/
    male-front-paths.ts
    male-back-paths.ts
    female-front-paths.ts
    female-back-paths.ts
  heatmap/
    color-scale.ts      ← HeatmapColorScale class + 6 presets
    color-interpolation.ts
  styles/
    body-view-style.ts  ← 4 style presets
  utils/
    color.ts            ← parseColor, interpolateColor, toCSSColor
  widget/
    muscle-map-widget.ts  ← Main public widget (primary entry point)
    heatmap-legend.ts     ← Standalone legend component
  i18n/
    locales.ts          ← 11 locale translations
```

## Guidelines

### Code Style
- TypeScript strict mode — no `any` unless absolutely necessary
- Prefer private class fields for internal state
- Use `readonly` for constants
- Document public methods with JSDoc comments

### Adding a New Feature
1. Check the existing [SwiftUI SDK](https://github.com/melihcolpan/MuscleMap) to maintain parity
2. Add the relevant TypeScript types to `src/types.ts`
3. Implement in the appropriate module
4. Export from `src/index.ts`
5. Add a usage example in `demo/index.html`

### Adding a New Locale
1. Open `src/i18n/locales.ts`
2. Add your locale code to the `Locale` type union
3. Add translations for all 36 muscles and the 7 UI strings
4. Open a PR

### Bug Reports
Please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- A minimal code example

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
