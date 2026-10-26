import type { IconItem } from '../types'

const RELATED_TERMS: Record<string, string[]> = {
  bin: ['trash', 'delete', 'wastebasket', 'recycle'],
  trash: ['bin', 'delete', 'wastebasket', 'rubbish'],
  delete: ['trash', 'bin', 'remove', 'erase'],
  remove: ['delete', 'trash', 'close'],
  person: ['user', 'profile', 'account'],
  people: ['users', 'group', 'team'],
  user: ['person', 'profile', 'account'],
  photo: ['image', 'picture', 'photograph'],
  image: ['photo', 'picture', 'photograph'],
  picture: ['image', 'photo'],
  magnifier: ['search', 'find'],
  search: ['find', 'magnifier', 'lookup'],
  settings: ['gear', 'cog', 'preferences'],
  gear: ['settings', 'cog'],
  cog: ['settings', 'gear'],
  mail: ['email', 'envelope', 'message'],
  email: ['mail', 'envelope'],
  favorite: ['heart', 'like', 'bookmark'],
  notification: ['bell', 'alert'],
  folder: ['directory', 'files'],
  directory: ['folder', 'files'],
  play: ['start', 'media'],
  pause: ['stop', 'media'],
  download: ['save', 'export'],
  upload: ['import', 'send'],
}

function words(value: string) {
  return value.toLowerCase().replace(/([a-z])([A-Z])/g, '$1 $2').split(/[^a-z0-9]+/).filter(Boolean)
}

function editDistance(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 2) return 3
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row++) {
    const current = [row]
    for (let column = 1; column <= right.length; column++) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[right.length]
}

export function iconSearchScore(icon: IconItem, query: string) {
  const queryWords = words(query)
  const nameWords = words(icon.name)
  const sourceWords = words(icon.source)
  const tagWords = icon.tags.flatMap(words)
  const categoryWords = words(icon.category)
  const allWords = [...nameWords, ...tagWords, ...sourceWords, ...categoryWords]
  let total = 0

  for (const queryWord of queryWords) {
    const alternatives = [queryWord, ...(RELATED_TERMS[queryWord] ?? [])]
    let best = 0
    for (const term of alternatives) {
      if (nameWords.some((word) => word === term)) best = Math.max(best, term === queryWord ? 100 : 74)
      else if (nameWords.some((word) => word.startsWith(term))) best = Math.max(best, term === queryWord ? 82 : 62)
      else if (allWords.some((word) => word === term)) best = Math.max(best, term === queryWord ? 58 : 44)
    }
    if (!best && queryWord.length >= 4) {
      const limit = queryWord.length > 7 ? 2 : 1
      if (allWords.some((word) => editDistance(queryWord, word) <= limit)) best = 24
    }
    if (!best) return 0
    total += best
  }

  return total / queryWords.length
}
