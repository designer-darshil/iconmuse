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

export function syncIconPacks(icons: Array<{ id: string; name: string; tags: string[] }>) {
  ICON_PACKS.forEach((pack) => {
    const terms = pack.matchTerms
    pack.iconIds = icons
      .filter((icon) => terms.some((term) => icon.name.toLowerCase().includes(term) || icon.tags.some((tag) => tag.includes(term))))
      .map((icon) => icon.id)
    pack.count = pack.iconIds.length
  })
}
