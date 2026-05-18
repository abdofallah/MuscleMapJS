# Changelog

All notable changes to MuscleMapJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-05-18

### Added
- **Core rendering engine** — Canvas2D rendering with `Path2D` for 86 body part paths
- **Four body models** — Male/Female × Front/Back with exact viewbox coordinate systems
- **36 muscle identifiers** — 22 base muscles + 14 sub-groups with full parent/child hierarchy
- **Multi-selection** with toggle, select/deselect, and batch operations (`selectMany`, `clearSelection`)
- **Highlight system** — solid color, linear gradient, and radial gradient fills per muscle
- **Heatmap visualization** — 6 preset color scales (workout, thermal, medical, monochrome, workoutStepped, thermalSmooth)
- **Heatmap gradient fill** — intra-muscle low→high gradient with configurable direction and factor
- **6 interpolation modes** — linear, easeIn, easeOut, easeInOut, step(n), custom function
- **4 style presets** — default, minimal, neon, medical
- **Tooltip overlay** — positioned HTML tooltip above muscle bounding rect, custom HTML renderer support
- **Selection history** — undo/redo stack with configurable max depth (50 entries default)
- **Highlight animations** — smooth cross-fade between highlight states using easeInOut `requestAnimationFrame`
- **Selection pulse** — sin-wave opacity animation on selected muscles
- **Long press gesture** — configurable duration (default 500ms) → `muscleLongPress` event
- **Drag-to-select** — continuous hit-test during pointer drag → `muscleDrag` / `muscleDragEnd` events
- **Bounding rect API** — `getBoundingRect(muscle)` returns CSS-pixel rect for tooltip/accessibility positioning
- **HeatmapLegend component** — standalone color bar with horizontal/vertical orientation and labels
- **Internationalization** — 11 locales: English, Arabic, German, Spanish, French, Japanese, Korean, Portuguese (Brazil), Russian, Turkish, Simplified Chinese
- **DPR-aware rendering** — automatic `devicePixelRatio` scaling for crisp HiDPI/Retina displays
- **Responsive sizing** — `ResizeObserver`-driven auto-resize
- **State serialization** — `getHighlightData()` / `setHighlightData()` for DB storage and restoration
- **Zero dependencies** — relies only on standard browser Canvas2D and DOM APIs
- **Full TypeScript** — 100% type-safe with strict mode, declaration files included
- **Interactive demo** — `demo/index.html` showcasing all features
