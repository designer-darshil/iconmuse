# Glass Icons (`gi`)

**A free, open-source frosted-glassmorphism icon set — 2,894 borderless, recolorable SVG icons.**

Glass Icons takes every icon in the Font Awesome **Free** collection and re-skins it in a soft
frosted-glass style: translucent milky body, glossy top highlight, subtle colored glow, and a
soft drop shadow — **with no container, frame, or border**. Each icon is a self-contained glyph
you can drop inline anywhere: inside buttons, next to text, in toolbars, on the web, or in
Android / iOS apps.

![Preview](./_preview.png)
![Demo](./demo.html)

---

## Features

- **2,894 icons** — the full Font Awesome Free set (solid, regular, brands), plus a handful of
  bespoke glyphs drawn in the same glass style.
- **Borderless** — the icon *is* the glass object; nothing to clip or contain it.
- **Recolorable with one value** — a single CSS variable (`--icon-color`) drives the entire
  glass look. Change one line and the whole icon retints while keeping the glass effect.
- **`currentColor` support** — make an icon follow its surrounding text color automatically.
- **Pure SVG** — no font file, no JS runtime, no build step required.
- **Sensible defaults** — every icon ships with a pleasant default color (assigned
  deterministically from its name), so the set looks good out of the box.

---

## What's inside

```
glass-icons/
├── solid/        2,017 icons   gi-solid-<name>.svg
├── regular/        290 icons   gi-regular-<name>.svg
├── brands/         587 icons   gi-brands-<name>.svg
├── _preview.png               sample grid
├── _recolor-demo.png          one icon shown in several colors
└── README.md
```

### Naming convention

```
gi-<style>-<name>.svg
```

| Part      | Values                          | Example                      |
|-----------|---------------------------------|------------------------------|
| `gi`      | project prefix (Glass Icons)    | `gi`                         |
| `<style>` | `solid` · `regular` · `brands`  | `solid`                      |
| `<name>`  | the original Font Awesome name  | `house`, `heart`, `github`   |

Examples: `gi-solid-house.svg`, `gi-regular-star.svg`, `gi-brands-github.svg`.

Each SVG has a `256 × 256` viewBox with the glyph centered.

---

## Demo / landing page

Open **`demo.html`** in any browser for a live landing page: a wall of glass icons that
recolor in real time when you change a single CSS variable, a browsable gallery, copy-paste
usage snippets, and a light / dark toggle. It's fully self-contained (icons are inlined).

## Quick start

Download the set and copy the `solid/`, `regular/`, and/or `brands/` folders into your project
(e.g. `assets/icons/`). That's it — no install required.

---

## Usage on the web

### 1. Inline SVG (recommended — fully recolorable)

Paste the SVG markup directly into your HTML, or load it inline (e.g. via a build-time include,
an `<svg><use>` sprite, or a framework component). Inline SVG is the only method that lets you
recolor via CSS.

```html
<!-- contents of gi-solid-bell.svg pasted inline -->
<span class="icon">
  <svg viewBox="0 0 256 256" ...> ... </svg>
</span>
```

### 2. Recoloring — the one knob

Every icon's color comes from a single CSS variable: **`--icon-color`**. Set it on the SVG or
any ancestor element.

```html
<!-- default color (built into the file) -->
<svg ...></svg>

<!-- recolor to blue -->
<svg style="--icon-color:#3B82F6" ...></svg>

<!-- follow the surrounding text color -->
<svg style="--icon-color: currentColor" ...></svg>
```

In CSS:

```css
.icon            { width: 24px; height: 24px; }
.icon--danger    { --icon-color: #EF4444; }
.icon--brand     { --icon-color: #6D28D9; }

/* react to state */
.btn:hover .icon { --icon-color: #ffffff; }
[data-theme="dark"] .icon { --icon-color: #93C5FD; }
```

If you never set `--icon-color`, the icon falls back to its built-in default color
(see `_preview.png`).

> The recolor demo below is **one** file (`gi-solid-bell.svg`) rendered with six different
> `--icon-color` values — the glass shading, highlight, and glow all retint automatically.

![Recolor demo](./_recolor-demo.png)

### 3. Sizing

These are not font glyphs, so `font-size` has no effect. Size with `width` / `height`
(or scale the parent). The artwork is vector and stays crisp at any size:

```css
.icon { width: 1.25rem; height: 1.25rem; } /* ~20px */
```

### 4. As an `<img>` (simple, but not recolorable)

```html
<img src="assets/icons/solid/gi-solid-heart.svg" width="24" height="24" alt="Favorite" />
```

When loaded through `<img>`, `src`-referenced SVG, or `background-image`, the browser isolates
the SVG, so `--icon-color` from your page **cannot** reach it — the icon shows its default color.
Use inline SVG when you need recoloring.

### 5. React example

```jsx
// Icon.jsx — inline the raw SVG string, expose color + size as props
export function Icon({ svg, color, size = 24, ...rest }) {
  return (
    <span
      style={{ display: 'inline-flex', width: size, height: size, '--icon-color': color }}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  );
}
// <Icon svg={bellSvg} color="#3B82F6" size={28} />
```

(With a bundler you can import an SVG as a component — e.g. SVGR for React or
`vite-svg-loader` for Vue — then pass `style="--icon-color: …"`.)

### 6. Accessibility

- Decorative icon: add `aria-hidden="true"` and no text alternative.
- Meaningful icon: give it a label, e.g. `role="img"` + a `<title>` inside the SVG, or
  `aria-label` on the wrapper.

```html
<svg role="img" aria-label="Notifications" viewBox="0 0 256 256" ...>
  <title>Notifications</title>
  ...
</svg>
```

---

## Usage in native apps (Android / iOS)

These icons are standard SVGs that use gradients and a blur filter. Native platforms don't read
CSS, so the `--icon-color` variable only applies on the web — in native apps each icon renders
in its **default** color.

- **Android:** render with an SVG library (e.g. AndroidSVG, Coil-SVG) or convert to
  `VectorDrawable`. Multi-stop gradients are supported from API 24+. The soft blur (an SVG
  filter) may not survive conversion to `VectorDrawable` — if you need the glow, render the SVG
  directly or ship a rasterized PNG set (`mdpi … xxxhdpi`).
- **iOS / SwiftUI:** render with an SVG library (e.g. SVGKit, SwiftSVG) or import vector PDFs.
  As above, the blur filter needs a renderer that supports SVG filter primitives; otherwise
  rasterize.

To recolor in native, edit the SVG's base color before bundling, or rasterize per color.

---

## Usage in Figma

- Import the SVGs by dragging files onto the canvas (do it **per folder**, or in batches of
  ~200–300, so Figma doesn't stall). Each file imports as a named frame.
- `var(--icon-color, …)` resolves to its **fallback (default) color** on import, so icons appear
  in their default colors.
- **Caveat:** Figma may drop the SVG blur filter on import, so the soft glow can look flatter on
  the Figma canvas. For full-fidelity output in your app, **use the SVG files from this package
  directly** — don't round-trip through Figma export. Treat Figma as a browsing/organizing
  library, not the source of truth.
- To recolor inside Figma, select the icon's fill layer(s) and change the color manually.

---

## How an icon is built (theming internals)

Each icon stacks a few layers, all reading from the same base color, so a single value can
retint everything:

1. **Glow** — a blurred copy of the glyph in the base color (the soft colored halo).
2. **Milky base** — a white copy of the glyph (the frosted translucency).
3. **Tint** — the glyph filled with a vertical gradient of the base color (lighter at the top,
   deeper at the bottom) for depth.
4. **Gloss** — a white top-down highlight plus a corner shine, clipped to the glyph silhouette.

The base color is injected as `var(--icon-color, <default>)`, which is why one variable controls
the whole stack.

---

## License & attribution

**Important — please keep this attribution when you redistribute.**

The icon shapes are **modified from Font Awesome Free**, whose icons are licensed under
**[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)** (© Fonticons, Inc.). CC BY 4.0
permits remixing, transforming, and building upon the work — including commercially — provided
you (1) give appropriate credit, (2) link to the license, and (3) **indicate that changes were
made**. These glass icons are adaptations of the original glyphs, so that requirement carries
over. A suitable credit line:

> Glass Icons — icon shapes **modified** from Font Awesome Free (https://fontawesome.com),
> licensed under CC BY 4.0. Original © Fonticons, Inc.

**Changes made:** each original Font Awesome glyph was restyled into a frosted-glass
treatment (translucent fill, gloss highlight, colored glow, soft shadow). The original
attribution and a modification notice are embedded as a comment at the top of every `.svg` file —
please don't strip those comments, as Font Awesome asks.

Font Awesome Free license summary: **Icons** — CC BY 4.0 · **Fonts** — SIL OFL 1.1 ·
**Code** — MIT. See https://fontawesome.com/license/free.

The glassmorphism styling in this repository is released under the
**MIT License** — you're free to use, modify, and redistribute it. If you publish this set,
add a `LICENSE` file with the MIT text plus your name/year, and keep this attribution section.

### Brand icons & trademarks (read before publishing `brands/`)

The `brands/` folder (e.g. GitHub, Figma, React, Spotify) needs extra care. The icon *artwork*
is CC BY 4.0 via Font Awesome, **but the underlying logos are trademarks of their respective
owners**, and trademark is separate from copyright. Many companies' brand guidelines **prohibit
altering or restyling their logo** — and a glassmorphism treatment is an alteration. So even
though Font Awesome's license allows the shapes, redistributing *restyled brand logos* may
conflict with those companies' trademark policies.

To stay safe when open-sourcing, consider one of:

- Ship only `solid/` and `regular/` and **exclude `brands/`**, or distribute `brands/` separately
  with a clear notice.
- Add a disclaimer: *"Brand marks are trademarks of their respective owners; their inclusion does
  not imply endorsement. Restyled brand icons may be subject to each owner's trademark policy."*
- Don't use a company's logo (restyled or not) in a way that implies that company endorses or is
  affiliated with this project.

This is general information, not legal advice — when in doubt, check the specific brand's
guidelines or consult a professional.

---

## Credits

- **Source glyphs:** [Font Awesome Free](https://fontawesome.com) by Fonticons, Inc.
- **Style inspiration:** "Glassmorphism – Glass Icon set" (Figma Community).
- **Glass treatment:** this project.
