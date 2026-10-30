# IconMuse

IconMuse is a searchable SVG catalog built from the upstream icon packages listed below. It previews, filters, compares, and exports the source SVGs.

## Search engine setup

The app includes indexable page metadata, Open Graph and X sharing metadata, `WebApplication` structured data, `robots.txt`, and a web manifest. Before production deploys, set `VITE_SITE_URL` to the final public HTTPS URL. This keeps the canonical and shared URL correct on the deployed domain.

## Development

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Icon catalog

The app loads the generated catalog manifest and compressed shards from `public/`. Rebuild them from the pinned package versions in `package-lock.json` with:

```sh
npm run catalog:build
```

The generator reads the installed upstream icon assets and writes their names, source, style, SPDX license, search tags, and SVG markup. It splits the catalog into versioned compressed shards to keep production requests small, and copies package license files to `public/icon-licenses/`.

Included icon packages:

- Lucide (`lucide-react`)
- Phosphor (`@phosphor-icons/core`)
- Tabler (`@tabler/icons`)
- Heroicons (`@heroicons/react`)
- Simple Icons (`simple-icons`)
- Feather (`feather-icons`)
- Remix Icon (`remixicon`)
- Lineicons (`lineicons`)
- Material Symbols (`@iconify-json/material-symbols`, Apache-2.0)
- Fluent System Icons (`@iconify-json/fluent`, MIT)
- Carbon Icons (`@iconify-json/carbon`, Apache-2.0)
- Bootstrap Icons (`@iconify-json/bi`, MIT)
- MingCute Icons (`@iconify-json/mingcute`, Apache-2.0)
- Open Peeps (`@dicebear/open-peeps`, CC0 artwork by Pablo Stanley)

The searchable library is sourced from these local package assets; pack definitions group matching catalog entries and calculate counts from the loaded data. Saved icons start empty and persist in browser storage.
