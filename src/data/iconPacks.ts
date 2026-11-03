export interface IconPack {
  id: string
  title: string
  description: string
  count: number
  accentColor: string
  iconIds: string[]
  matchTerms: string[]
}

export const ICON_PACKS: IconPack[] = [
  {
    id: 'pack-essential-ui',
    title: 'Interface essentials',
    description: 'Navigation, search, settings, and common actions.',
    count: 0,
    accentColor: '#7141E8',
    iconIds: [],
    matchTerms: ['arrow', 'menu', 'search', 'settings', 'home', 'user', 'check', 'close', 'filter', 'grid', 'layout', 'bell', 'calendar', 'clock', 'plus', 'minus'],
  },
  {
    id: 'pack-ecommerce',
    title: 'Shopping and payments',
    description: 'Cart, checkout, payment, receipt, and delivery icons.',
    count: 0,
    accentColor: '#059669',
    iconIds: [],
    matchTerms: ['cart', 'shopping', 'store', 'wallet', 'credit', 'payment', 'dollar', 'banknote', 'truck', 'package', 'tag', 'receipt', 'gift', 'bag'],
  },
  {
    id: 'pack-dev-cloud',
    title: 'Development tools',
    description: 'Code, version control, terminals, and developer tools.',
    count: 0,
    accentColor: '#D97706',
    iconIds: [],
    matchTerms: ['code', 'git', 'terminal', 'database', 'server', 'cloud', 'api', 'workflow', 'branch', 'commit', 'pull request', 'cpu', 'command', 'bug', 'braces'],
  },
  {
    id: 'pack-creative-media',
    title: 'Photo, video, and audio',
    description: 'Photography, video, audio, and creative tools.',
    count: 0,
    accentColor: '#E11D48',
    iconIds: [],
    matchTerms: ['camera', 'video', 'film', 'image', 'palette', 'pen', 'brush', 'crop', 'aperture', 'music', 'headphones', 'mic', 'play', 'sparkles'],
  },
  {
    id: 'pack-security-auth',
    title: 'Security and access',
    description: 'Access, identity, privacy, and security controls.',
    count: 0,
    accentColor: '#0284C7',
    iconIds: [],
    matchTerms: ['shield', 'lock', 'key', 'fingerprint', 'security', 'password', 'scan', 'user check', 'eye', 'badge', 'verified', 'safe'],
  },
  {
    id: 'pack-nature-climate',
    title: 'Nature and weather',
    description: 'Weather, plants, and the natural world.',
    count: 0,
    accentColor: '#0D9488',
    iconIds: [],
    matchTerms: ['sun', 'moon', 'cloud', 'wind', 'tree', 'leaf', 'snowflake', 'flame', 'rain', 'nature', 'flower', 'water', 'earth', 'temperature'],
  },
]

let syncedCatalogLength = 0

export function applyPrecomputedPackCounts(packCounts?: Record<string, number> | null) {
  if (!packCounts) return
  for (const pack of ICON_PACKS) {
    if (typeof packCounts[pack.id] === 'number') {
      pack.count = packCounts[pack.id]
    }
  }
}

export function matchesIconPack(icon: { name: string; tags: string[] }, pack: IconPack): boolean {
  const lowerName = icon.name.toLowerCase()
  const tags = icon.tags
  return pack.matchTerms.some((term) => lowerName.includes(term) || tags.some((tag) => tag.includes(term)))
}

export function syncIconPacks(icons: Array<{ id: string; name: string; tags: string[] }>, packId?: string) {
  if (packId) {
    const target = ICON_PACKS.find((p) => p.id === packId)
    if (!target || (target.iconIds.length > 0 && syncedCatalogLength === icons.length)) return
    const matches: string[] = []
    for (const icon of icons) {
      if (matchesIconPack(icon, target)) matches.push(icon.id)
    }
    target.iconIds = matches
    target.count = matches.length
    return
  }

  syncedCatalogLength = icons.length
  ICON_PACKS.forEach((pack) => {
    const matches: string[] = []
    for (const icon of icons) {
      if (matchesIconPack(icon, pack)) matches.push(icon.id)
    }
    pack.iconIds = matches
    pack.count = pack.iconIds.length
  })
}
