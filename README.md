# Iconora — Modern Vector Icon Discovery Workspace

Iconora is a production-quality, responsive icon-discovery workspace engineered with React 19, TypeScript, Tailwind CSS, SCSS design tokens, Lucide React, and Framer Motion. It provides an airy, canvas-centered design tool experience with optical size inspection, live color recoloring, deep-linkable URLs, side-by-side icon comparison, and SVG/PNG export options.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (Vite HMR)
npm run dev

# 3. Build for production (TypeScript check + Vite bundle)
npm run build

# 4. Preview the production build locally
npm run preview
```

The dev server will run by default at `http://localhost:5173/` or `http://localhost:5174/`.

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── common/         # Global ErrorBoundary and shared visual state guards
│   ├── detail/         # Deep-linkable IconDetailModal with live 3-stage customizer
│   ├── layout/         # AnnouncementStrip, DesktopHeader, LeftNavRail, RightSidebar, MobileTopBar, MobileDrawer
│   ├── placeholders/   # InspectorPlaceholder and empty states
│   ├── sidebar/        # FiltersPanel, PacksPanel, SavedPanel
│   └── workspace/      # IconGrid, IconTile, MainToolbar, SortRow, CompareTray, CompareModal
├── data/
│   ├── mockIcons.ts    # 96 curated mock icons across 13 categories and 5 icon sets
│   ├── mockPacks.ts    # Thematic icon packs (Essential UI, Commerce, Media, etc.)
│   └── navigation.ts   # Left navigation rail structure
├── hooks/
│   ├── useBreakpoint.ts # Breakpoint detection (Mobile <768px, Tablet 768-1279px, Desktop ≥1280px)
│   ├── useIconFilters.ts # Query param sync, search, filtering, and localStorage persistence
│   └── useShellState.ts  # Sidebar, drawer, and selection state management
├── styles/
│   ├── _tokens.scss     # CSS Custom Properties (--ink, --canvas, --line, --violet, etc.)
│   ├── _typography.scss # Poppins font definitions and typography scale
│   ├── _layout.scss     # App grid shell, responsive rail/sidebar layout, scrollbars
│   ├── main.scss        # Global reset, focus rings, 1px hover lift, reduced-motion rules
│   └── tailwind.css     # Tailwind v4 import with @theme breakpoints
└── types/
    └── index.ts         # Strongly typed data contracts (IconItem, CategoryItem, IconPack, etc.)
```

---

## 🎨 Where Mock Icon Data Lives

- **Mock Icons Dataset**: [`src/data/mockIcons.ts`](file:///Users/jarvis/MySites/HTML/icons-lib/src/data/mockIcons.ts)
  - Exports `MOCK_ICONS`: Array of `IconItem` records with Lucide icon components, SVG paths, categories, tags, licenses, and popularity scores.
  - Exports `MOCK_CATEGORIES`: Array of `CategoryItem` records with slug, display name, and icon counts.
- **Mock Curated Packs**: [`src/data/mockPacks.ts`](file:///Users/jarvis/MySites/HTML/icons-lib/src/data/mockPacks.ts)
  - Exports `MOCK_PACKS`: Curated packs with cover colors, description, and referenced `iconIds`.

---

## 🔌 Replacing Mock Data with a Real Licensed Icon API

To replace the local mock data with a real licensed icon REST or GraphQL API (such as Iconify, Lucide API, or a custom licensed icon backend), follow this adapter pattern:

### 1. The Core Data Contract (`src/types/index.ts`)
Ensure your API responses map into the existing `IconItem` interface:
```typescript
export interface IconItem {
  id: string
  name: string
  category: string
  tags: string[]
  source: 'Lucide' | 'Phosphor' | 'Tabler' | 'Heroicons' | 'Simple Icons' | string
  style: 'stroke' | 'solid' | 'duotone' | 'thin'
  license: 'MIT' | 'Apache 2.0' | 'CC BY 4.0' | string
  popularity: number
  strokeWidth?: number
  component: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>
  svgPath?: string
}
```

### 2. Creating an API Client Adapter (`src/services/iconApi.ts`)
Create a service that queries your endpoint and parses raw SVGs into renderable components:
```typescript
// src/services/iconApi.ts
import type { IconItem } from '../types'

export async function fetchIconsFromApi(params: {
  search?: string
  category?: string
  page?: number
  limit?: number
}): Promise<{ icons: IconItem[]; total: number }> {
  const query = new URLSearchParams()
  if (params.search) query.set('q', params.search)
  if (params.category && params.category !== 'all') query.set('category', params.category)
  query.set('page', String(params.page || 1))
  query.set('limit', String(params.limit || 72))

  const response = await fetch(`https://api.your-icon-provider.com/v1/icons?${query}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_ICON_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch icons: ${response.statusText}`)
  }

  const data = await response.json()

  // Map API response to IconItem
  const icons: IconItem[] = data.items.map((item: any) => ({
    id: item.id,
    name: item.title,
    category: item.category,
    tags: item.tags || [],
    source: item.collection_name,
    style: item.style || 'stroke',
    license: item.license || 'MIT',
    popularity: item.download_count || 100,
    strokeWidth: 2,
    // Render dynamic SVG paths from the API
    component: ({ className, style, strokeWidth }: any) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: item.svg_body }}
      />
    ),
  }))

  return { icons, total: data.total }
}
```

### 3. Integrating with `useIconFilters`
In `src/hooks/useIconFilters.ts`, substitute the static `MOCK_ICONS` filter calculation with a query hook (e.g. TanStack Query or native `useEffect` + `fetchIconsFromApi`):
```typescript
const [icons, setIcons] = useState<IconItem[]>([])
const [isLoading, setIsLoading] = useState<boolean>(false)

useEffect(() => {
  let isMounted = true
  setIsLoading(true)

  fetchIconsFromApi({
    search: filters.searchQuery,
    category: filters.category,
  })
    .then(({ icons }) => {
      if (isMounted) setIcons(icons)
    })
    .catch(console.error)
    .finally(() => {
      if (isMounted) setIsLoading(false)
    })

  return () => { isMounted = false }
}, [filters.searchQuery, filters.category])
```

---

## ♿ Accessibility & Motion Standards

- **Reduced Motion**: All animations automatically query `useReducedMotion()` from Framer Motion and `@media (prefers-reduced-motion: reduce)` in CSS to disable transforms and spring effects for sensitive users.
- **Focus Trapping**: Modal dialogs (`IconDetailModal`, `CompareModal`) and mobile menus (`MobileDrawer`) trap keyboard focus with <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd> cycling and close on <kbd>Escape</kbd>, returning focus to the trigger element on unmount.
- **Touch Ergonomics**: All interactive mobile triggers maintain at least 44×44px tap targets.
- **Deep Linking**: Selecting an icon updates the URL query string (`?icon=<id>`), enabling browser Back/Forward navigation and direct link sharing.
