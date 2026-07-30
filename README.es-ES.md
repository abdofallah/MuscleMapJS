

# MuscleMapJS

> **SDK interactivo de mapa muscular del cuerpo humano para la web.**  
> Port de TypeScript/Canvas del [SDK de MuscleMap SwiftUI](https://github.com/melihcolpan/MuscleMap).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)](package.json)

<table>
  <tr>
    <td><img src="screenshots/male_front_default.png" width="200" alt="Vista anterior masculina — Estilo predeterminado"></td>
    <td><img src="screenshots/female_front_neon.png" width="200" alt="Vista anterior femenina — Estilo Neón con selección"></td>
    <td><img src="screenshots/male_heatmap_workout.png" width="170" style="display: inline" alt="Vista anterior masculina — Mapa de calor de entrenamiento"></td>
    <td><img src="screenshots/male_back_medical.png" width="170" style="display: inline" alt="Vista posterior masculina — Estilo médico"></td>
  </tr>
</table>


---

## Características

- 🎨 **Renderizado en Canvas2D** — dibujo nítido y consciente de DPR en pantallas HiDPI/Retina  
- 👤 **4 modelos corporales** — Masculino/Femenino × Frontal/Posterior, 86 partes corporales en total  
- 💪 **36 músculos** — 22 principales + 14 subgrupos (upper-chest, front-deltoid, inner-quad, etc.)  
- 🖱️ **Interacción completa** — clic, desplazamiento, pulsación prolongada (500 ms), arrastrar para seleccionar  
- 🌈 **Visualización de mapas de calor** — 6 escalas de color, rellenos degradados intramusculares, interpolación configurable  
- 💡 **Superposición de tooltips** — tooltip HTML posicionado sobre cada músculo, soporte para renderizador personalizado  
- ↩️ **Deshacer / Rehacer** — historial de selección con profundidad configurable  
- ✨ **Animaciones** — desvanecimiento cruzado suave del resaltado y pulso de onda sinusoidal en músculos seleccionados  
- 🗺️ **Componente de leyenda** — barra de color `HeatmapLegend` (horizontal/vertical)  
- 🌍 **11 idiomas/locales** — Árabe, Chino, Inglés, Francés, Alemán, Japonés, Coreano, Portugués, Ruso, Español, Turco  
- 🎨 **4 estilos predefinidos** — Predeterminado, Minimalista, Neón, Médico  
- 💾 **Serialización de estado** — guardar/restaurar músculos resaltados como JSON simple  
- **Cero dependencias** — APIs puras de Canvas2D + DOM del navegador

---

## Inicio rápido

```html
<!-- Add a sized container -->
<div id="muscle-map" style="width: 400px; height: 600px;"></div>

<script type="module">
  import { MuscleMapWidget } from './MuscleMapJS/src/index.ts';

  const map = new MuscleMapWidget(document.getElementById('muscle-map'), {
    gender: 'female',
    side: 'front',
    style: 'default',
    multiSelect: true,
  });

  // Listen for muscle clicks
  map.on('muscleClick', (muscle, side) => {
    console.log(`Selected: ${muscle} (${side})`);
  });

  // Get selection for saving to DB
  document.querySelector('#save').addEventListener('click', () => {
    const data = map.getHighlightData();
    // → [{ muscle: 'chest', color: '#00c853', opacity: 1 }, ...]
  });
</script>
```

> 💡 **Funciona inmediatamente con Vite, Astro o cualquier empaquetador que soporte importaciones de TypeScript.**

---

## Instalación

### Vía submódulo de Git (recomendado para proyectos Astro/Vite)

```bash
git submodule add https://github.com/abdofallah/MuscleMapJS.git src/lib/MuscleMapJS
```

### Clonación manual

```bash
git clone https://github.com/abdofallah/MuscleMapJS.git
```

Luego importa directamente desde el punto de entrada `src/index.ts`.

---

## Referencia de la API

### Creación de un Widget

```typescript
const map = new MuscleMapWidget(container: HTMLElement, options?: MuscleMapOptions);
```

| Opción | Tipo | Predeterminado | Descripción |
|--------|------|---------|-------------|
| `gender` | `'male' \| 'female'` | `'male'` | Género del modelo corporal |
| `side` | `'front' \| 'back'` | `'front'` | Cara del cuerpo a mostrar |
| `style` | `StylePreset \| BodyViewStyle` | `'default'` | Tema visual |
| `interactive` | `boolean` | `true` | Habilitar interacciones con puntero |
| `multiSelect` | `boolean` | `true` | Permitir seleccionar múltiples músculos |
| `showSubGroups` | `boolean` | `false` | Mostrar regiones de subgrupos |
| `onMuscleClick` | `(muscle, side) => void` | — | Escucha de eventos abreviada |
| `onSelectionChange` | `(muscles) => void` | — | Escucha de eventos abreviada |

---

### Resaltado

```typescript
// Solid color
map.highlight('chest', '#ff4444', 0.9);
map.highlightMany(['biceps', 'triceps'], '#00c853');

// Gradients (ported from BodyView.swift modifiers)
map.highlightLinearGradient('abs', ['#ffeb3b', '#f44336'], 0, 0, 0, 1);
map.highlightRadialGradient('gluteal', ['#ff9800', '#f44336']);

// Raw MuscleHighlight object
map.setHighlight('chest', { muscle: 'chest', fill: { type: 'color', color: 'red' }, opacity: 1 });

// Removal
map.removeHighlight('chest');
map.clearHighlights();

// Inspection
map.getHighlightedMuscles();     // → Muscle[]
map.getHighlightData();          // → serializable array (for DB storage)
map.setHighlightData(saved);     // restore from DB
```

---

### Selección

```typescript
map.select('biceps');
map.selectMany(['chest', 'abs', 'obliques']);
map.deselect('chest');
map.toggleSelect('biceps');
map.clearSelection();
map.getSelectedMuscles();         // → Muscle[]
```

---

### Mapa de calor

```typescript
// Integer intensity (0–4 scale)
map.setIntensities({ chest: 4, biceps: 2, calves: 1 }, 'workout');

// Float intensity (0.0–1.0) with full config
map.setHeatmap([
  { muscle: 'chest', intensity: 0.9 },
  { muscle: 'quadriceps', intensity: 0.7 },
], {
  colorScale: 'thermal',          // 'workout' | 'thermal' | 'medical' | 'monochrome' | ...
  interpolation: { type: 'easeInOut' },
  threshold: 0.1,                 // skip muscles below this intensity
  gradientFill: true,             // use intra-muscle gradient
  gradientDirection: 'topToBottom',
  gradientLowFactor: 0.2,
});
```

**Escalas de color disponibles:** `workout`, `thermal`, `medical`, `monochrome`, `workoutStepped`, `thermalSmooth`

---

### Leyenda del mapa de calor

```typescript
import { HeatmapLegend } from './MuscleMapJS/src/index.ts';

const legend = new HeatmapLegend(container, {
  colorScale: 'workout',
  orientation: 'horizontal',    // or 'vertical'
  barThickness: 16,
  labelMin: 'Low',
  labelMax: 'High',
  steps: 48,
});
```

---

### Tooltip

```typescript
// Default: shows muscle display name
map.enableTooltip();

// Custom HTML renderer
map.enableTooltip((muscle, side) => {
  return `<strong>${muscle}</strong><br><small>${side} side</small>`;
});

map.disableTooltip();
```

---

### Deshacer / Rehacer

```typescript
map.enableHistory(50);    // enable with max 50 entries

map.undo();               // → Muscle[] | null (restored selection)
map.redo();               // → Muscle[] | null

map.canUndo;              // → boolean
map.canRedo;              // → boolean
```

---

### Animaciones

```typescript
// Smooth cross-fade on highlight changes
map.enableAnimation(300);    // duration in ms
map.disableAnimation();

// Pulse effect on selected muscles
map.enablePulse(
  1.5,   // speed (cycles/sec)
  0.6,   // min opacity
  1.0,   // max opacity
);
map.disablePulse();
```

---

### Eventos

```typescript
map.on('muscleClick',     (muscle: Muscle, side: MuscleSide) => void);
map.on('muscleEnter',     (muscle: Muscle, side: MuscleSide) => void);
map.on('muscleLeave',     () => void);
map.on('selectionChange', (muscles: Muscle[]) => void);
map.on('muscleLongPress', (muscle: Muscle, side: MuscleSide) => void);
map.on('muscleDrag',      (muscle: Muscle, side: MuscleSide) => void);
map.on('muscleDragEnd',   () => void);

map.off('muscleClick', handler);
```

---

### Internacionalización

```typescript
import { setLocale, getMuscleName, getUIString } from './MuscleMapJS/src/index.ts';

setLocale('ar');                         // Arabic
getMuscleName('chest');                  // → 'الصدر'
getMuscleName('biceps', 'ja');           // → '上腕二頭筋'
getUIString('legendLow');                // → 'منخفض'
```

**Idiomas compatibles:** `en` · `ar` · `de` · `es` · `fr` · `ja` · `ko` · `pt-BR` · `ru` · `tr` · `zh-Hans`

---

### Configuración

```typescript
map.setGender('female');
map.setSide('back');
map.setStyle('neon');          // 'default' | 'minimal' | 'neon' | 'medical'
map.setInteractive(false);
map.setLongPressDuration(700); // ms
map.getBoundingRect('chest');  // → { x, y, width, height } in CSS pixels
map.redraw();
map.destroy();                 // cleanup — removes canvas + listeners
```

---

## Estilos predefinidos

| Estilo | Relleno | Selección | Sombra | Ideal para |
|--------|------|-----------|--------|----------|
| `default` | Gris claro | Verde | Ninguna | Uso general |
| `minimal` | Gris más claro | Verde | Ninguna | Interfaz embebida |
| `neon` | Carbón oscuro | Cian | Brillo cian | Apps en modo oscuro |
| `medical` | Azul-gris clínico | Azul | Ninguna | Entorno clínico/profesional |

---

## Referencia de músculos

<details>
<summary>Todos los 36 músculos (haz clic para expandir)</summary>

**Músculos principales (22):**  
`abs` · `biceps` · `calves` · `chest` · `deltoids` · `feet` · `forearm` · `gluteal` · `hamstring` · `hands` · `head` · `knees` · `lower-back` · `obliques` · `quadriceps` · `tibialis` · `trapezius` · `triceps` · `upper-back` · `rotator-cuff` · `serratus` · `rhomboids`

**Subgrupos (14):**  
`ankles` · `adductors` · `neck` · `hip-flexors` · `upper-chest` · `lower-chest` · `inner-quad` · `outer-quad` · `upper-abs` · `lower-abs` · `front-deltoid` · `rear-deltoid` · `upper-trapezius` · `lower-trapezius`

</details>

---

## Ejecutar la demostración

```bash
npm install
npm run dev
# → http://localhost:5173/demo/index.html
```

La demostración muestra todas las características: selección de músculos, mapas de calor, rellenos degradados, tooltip, animación de pulso, deshacer/rehacer, cambio de idioma y el componente de leyenda.

---

## Ejemplo de integración (Astro)

```astro
---
// src/components/MuscleSelector.astro
---
<div id="muscle-map" class="w-full h-[600px]"></div>
<button id="save-btn">Save Muscles</button>

<script>
  import { MuscleMapWidget, setLocale, getMuscleName } from '../lib/MuscleMapJS/src/index';

  const map = new MuscleMapWidget(document.getElementById('muscle-map'), {
    gender: 'female',
    side: 'front',
    style: 'medical',
    multiSelect: true,
  });

  map.enableTooltip((muscle) => getMuscleName(muscle));
  map.enableHistory();

  document.getElementById('save-btn').addEventListener('click', () => {
    const muscles = map.getHighlightData();
    // persist to your DB / API
  });
</script>
```

---

## Soporte para TypeScript

El SDK está escrito íntegramente en TypeScript con modo estricto. Todos los tipos se exportan desde `src/index.ts`:

```typescript
import type {
  Muscle, MuscleSide, BodySide, BodyGender,
  MuscleHighlight, MuscleIntensity,
  HeatmapConfig, StylePreset, BodyViewStyle,
  MuscleMapOptions, MuscleEvent,
} from './MuscleMapJS/src/index.ts';
```

---

## Estructura del proyecto

```
src/
  index.ts                  ← Punto de entrada de la API pública
  types.ts                  ← Todas las interfaces y uniones de tipos
  core/
    body-renderer.ts        ← Motor Canvas2D (renderizado, hitTest, boundingRect)
    body-path-data.ts       ← Configuraciones de ViewBox y proveedor de datos de rutas
    muscles.ts              ← 36 músculos, jerarquía, nombres para mostrar
  data/
    male-front-paths.ts     ← Rutas SVG para cuerpo masculino frontal (auto-generado)
    male-back-paths.ts
    female-front-paths.ts
    female-back-paths.ts
  heatmap/
    color-scale.ts          ← HeatmapColorScale + 6 estilos predefinidos
    color-interpolation.ts  ← 6 curvas de interpolación
  styles/
    body-view-style.ts      ← 4 estilos predefinidos + resolvedor
  utils/
    color.ts                ← parseColor, interpolateColor, toCSSColor
  widget/
    muscle-map-widget.ts    ← Clase principal del widget (punto de entrada principal)
    heatmap-legend.ts       ← Componente de leyenda independiente
  i18n/
    locales.ts              ← 11 idiomas, 396 cadenas traducidas
demo/
  index.html                ← Ventana interactiva de características
```

---

## Licencia

[MIT](LICENSE) © 2026

---

## Agradecimientos

Este proyecto es un port de JavaScript/TypeScript del excelente **[SDK de MuscleMap SwiftUI](https://github.com/melihcolpan/MuscleMap)** creado por **[Melih Çolpan](https://github.com/melihcolpan)**.

El SDK original en Swift proporcionó:
- Los datos de rutas SVG de las partes del cuerpo (86 rutas en 4 modelos corporales)
- La taxonomía muscular (36 músculos con jerarquía completa de subgrupos)
- El diseño de la API de configuración del mapa de calor
- El sistema de estilos predefinidos y el lenguaje de diseño visual
- Las claves de cadenas de accesibilidad

MuscleMapJS recrea estas características nativamente en TypeScript utilizando Canvas2D del navegador, añade capacidades específicas para la web (tooltip, deshacer/rehacer, i18n, componente de leyenda, gestos de arrastrar/pulsación prolongada, animaciones) y las empaqueta como una biblioteca sin dependencias, adecuada para cualquier proyecto web moderno.

> Un sincero **JazakAllah Khair** y gracias a Melih Çolpan por publicar el SDK original bajo la Licencia MIT — este proyecto no existiría sin él. 🤝

---

*Construido con ❤️ para la web.*
