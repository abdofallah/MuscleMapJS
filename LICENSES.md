# Dependency Licenses

MuscleMapJS has **zero runtime dependencies**.

## Development Dependencies

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| [typescript](https://github.com/microsoft/TypeScript) | ^6.0 | Apache-2.0 | TypeScript compiler for type checking |
| [vite](https://github.com/vitejs/vite) | ^6.0 | MIT | Dev server for the interactive demo |

Both are `devDependencies` only — they are **not bundled** into the SDK and are not required by consumers.

## Attribution

The SVG body path data and muscle hierarchy used in this SDK are derived from:

- **[MuscleMap SwiftUI SDK](https://github.com/melihcolpan/MuscleMap)** by Melih Çolpan — MIT License
  - Original body part path data (SVG coordinates)
  - Muscle enum definitions and sub-group hierarchy
  - Heatmap color scale and configuration system
  - Style presets (default, minimal, neon, medical)
  - Accessibility string keys

The JavaScript/TypeScript implementation, rendering engine, widget API, i18n system, and all web-specific features are original work licensed under MIT.
