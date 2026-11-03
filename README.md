# IconMuse

IconMuse is a searchable SVG catalog built from the upstream icon packages listed below. It previews, filters, compares, and exports the source SVGs.

## Search engine setup

The app includes indexable page metadata, Open Graph and X sharing metadata, `WebApplication` structured data, `robots.txt`, and a web manifest. Before production deploys, set `VITE_SITE_URL` to the final public HTTPS URL. This keeps the canonical and shared URL correct on the deployed domain.

## Development

```sh
npm install
npm run dev
```

Run checks and verification:

```sh
npm run lint         # Run OxLint checks
npm run typecheck    # Check TypeScript types
npm run contrast:check # Check WCAG color contrast
npm run check        # Run linter, typecheck, and contrast checks together
```

Create a production build with `npm run build` and preview it with `npm run preview`.

### Figma plugin & API

The repository also includes the Figma plugin and its Cloudflare Worker backend in `figma-plugin/`:

```sh
npm run figma:data           # Generate Worker static data from catalog
npm run figma:build          # Build the Figma plugin UI and sandbox code
npm run figma:worker:dev     # Start the local Cloudflare Worker API
npm run figma:worker:deploy  # Deploy the Worker API
```

## Icon catalog

The app loads the generated catalog manifest and compressed shards from `public/`. Rebuild them from the pinned package versions in `package-lock.json` with:

```sh
npm run catalog:build
```

The generator reads the installed upstream icon assets and writes compact searchable metadata plus versioned, source-local compressed SVG shards. The app loads metadata at startup and fetches only the shards needed by visible results, which keeps global search and provider counts available without downloading the full artwork library on every visit. Versioned shard files are cached as immutable assets; the manifest is revalidated so deployments can switch catalog versions safely. The generator also copies package license files to `public/icon-licenses/`.

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
