import type { CategoryItem } from '../types'
import { ICON_CATALOG } from './iconCatalog'

export function getIconCategories(): CategoryItem[] {
  const illustrationsCount = ICON_CATALOG.filter((icon) => icon.category === 'Illustrations').length
  return [
    { id: 'cat-all', name: 'All Icons', count: ICON_CATALOG.length, slug: 'all' },
    ...(illustrationsCount > 0
      ? [{ id: 'cat-illustrations', name: 'Illustrations', count: illustrationsCount, slug: 'illustrations' }]
      : []),
  ]
}
