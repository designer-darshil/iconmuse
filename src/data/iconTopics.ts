import type { IconItem } from '../types'

export interface IconTopic {
  id: string
  label: string
  matches: (icon: IconItem) => boolean
}

const wordSetCache = new WeakMap<IconItem, Set<string>>()

function getIconWords(icon: IconItem): Set<string> {
  let set = wordSetCache.get(icon)
  if (!set) {
    set = new Set(icon.tags)
    for (const part of icon.name.toLowerCase().split(/[^a-z0-9]+/)) {
      if (part) set.add(part)
    }
    wordSetCache.set(icon, set)
  }
  return set
}

const hasTerm = (icon: IconItem, terms: string[]) => {
  const words = getIconWords(icon)
  return terms.some((term) => words.has(term))
}

export const ICON_TOPICS: IconTopic[] = [
  { id: 'arrows', label: 'Arrows', matches: (icon) => hasTerm(icon, ['arrow', 'chevron', 'caret', 'direction', 'turn', 'move']) },
  { id: 'transport', label: 'Transport', matches: (icon) => hasTerm(icon, ['car', 'bus', 'truck', 'taxi', 'bike', 'bicycle', 'plane', 'train', 'tram', 'ship', 'boat', 'scooter', 'road', 'traffic', 'transport']) },
  { id: 'albums', label: 'Albums', matches: (icon) => hasTerm(icon, ['album', 'albums', 'disc', 'music', 'playlist', 'audio', 'headphone', 'speaker', 'microphone', 'record', 'volume']) },
  { id: 'brands', label: 'Brands', matches: (icon) => icon.source === 'Simple Icons' },
  { id: 'development', label: 'Development', matches: (icon) => hasTerm(icon, ['code', 'terminal', 'database', 'server', 'git', 'branch', 'bug', 'api', 'command', 'programming', 'bracket', 'dev']) },
  { id: 'education', label: 'Education', matches: (icon) => hasTerm(icon, ['book', 'education', 'school', 'graduation', 'student', 'pencil', 'library', 'chalkboard', 'classroom', 'teacher']) },
  { id: 'communication', label: 'Communication', matches: (icon) => hasTerm(icon, ['message', 'chat', 'mail', 'email', 'phone', 'call', 'comment', 'send', 'share', 'conversation']) },
  { id: 'media', label: 'Media', matches: (icon) => hasTerm(icon, ['camera', 'image', 'video', 'film', 'photo', 'play', 'youtube', 'media', 'screen', 'broadcast']) },
  { id: 'navigation', label: 'Navigation', matches: (icon) => hasTerm(icon, ['map', 'pin', 'location', 'compass', 'navigation', 'globe', 'route', 'marker']) },
  { id: 'commerce', label: 'Commerce', matches: (icon) => hasTerm(icon, ['cart', 'shop', 'store', 'bag', 'wallet', 'payment', 'credit', 'receipt', 'checkout', 'money', 'cash', 'coin']) },
  { id: 'nature', label: 'Nature', matches: (icon) => hasTerm(icon, ['leaf', 'tree', 'flower', 'plant', 'earth', 'nature', 'animal', 'bird', 'fish', 'bug', 'paw']) },
  { id: 'security', label: 'Security', matches: (icon) => hasTerm(icon, ['lock', 'key', 'shield', 'security', 'password', 'fingerprint', 'privacy', 'verified', 'safe']) },
  { id: 'devices', label: 'Devices', matches: (icon) => hasTerm(icon, ['computer', 'laptop', 'desktop', 'tablet', 'mobile', 'device', 'keyboard', 'mouse', 'monitor', 'printer']) },
  { id: 'files', label: 'Files & folders', matches: (icon) => hasTerm(icon, ['file', 'folder', 'document', 'archive', 'attachment', 'paperclip', 'download', 'upload']) },
]

export function getIconTopicCounts(icons: IconItem[], precomputed?: Record<string, number> | null) {
  if (precomputed && Object.keys(precomputed).length > 0) {
    return precomputed
  }
  const iconItems = icons.filter((icon) => icon.category === 'Icons')
  return Object.fromEntries([
    ['all', iconItems.length],
    ['illustrations', icons.filter((icon) => icon.category === 'Illustrations').length],
    ...ICON_TOPICS.map((topic) => [topic.id, iconItems.filter(topic.matches).length]),
  ]) as Record<string, number>
}
