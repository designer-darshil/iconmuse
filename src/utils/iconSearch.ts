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

interface SearchIndex {
  count: number
  allWords: Map<string, number[]>
  nameWords: Map<string, number[]>
  allVocabulary: string[]
  nameVocabulary: string[]
}

const searchIndexes = new WeakMap<IconItem[], SearchIndex>()
let lastQuery = ''
let lastQueryTerms: string[][] = []

function searchIndex(icons: IconItem[]): SearchIndex {
  const cached = searchIndexes.get(icons)
  if (cached && cached.count === icons.length) return cached

  const allWords = new Map<string, number[]>()
  const nameWords = new Map<string, number[]>()
  const addWords = (target: Map<string, number[]>, values: string[], iconIndex: number, seen: Set<string>) => {
    for (const word of values) {
      if (seen.has(word)) continue
      seen.add(word)
      let matches = target.get(word)
      if (!matches) target.set(word, (matches = []))
      matches.push(iconIndex)
    }
  }

  icons.forEach((icon, iconIndex) => {
    const name = words(icon.name)
    const seenAll = new Set<string>()
    const seenName = new Set<string>()
    addWords(nameWords, name, iconIndex, seenName)
    addWords(allWords, name, iconIndex, seenAll)
    addWords(allWords, words(icon.source), iconIndex, seenAll)
    addWords(allWords, words(icon.category), iconIndex, seenAll)
    for (const tag of icon.tags) addWords(allWords, words(tag), iconIndex, seenAll)
  })

  const index = {
    count: icons.length,
    allWords,
    nameWords,
    allVocabulary: [...allWords.keys()],
    nameVocabulary: [...nameWords.keys()],
  }
  searchIndexes.set(icons, index)
  return index
}

function queryTerms(query: string) {
  if (query !== lastQuery) {
    lastQuery = query
    lastQueryTerms = words(query).map((word) => [word, ...(RELATED_TERMS[word] ?? [])])
  }
  return lastQueryTerms
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

export function searchIcons(icons: IconItem[], query: string) {
  const termsByWord = queryTerms(query)
  if (termsByWord.length === 0) return []

  const index = searchIndex(icons)
  let ranked = new Map<number, number>()
  for (const alternatives of termsByWord) {
    const queryWord = alternatives[0]
    const scores = new Map<number, number>()
    const add = (matches: number[] | undefined, score: number) => {
      if (!matches) return
      for (const iconIndex of matches) {
        const previous = scores.get(iconIndex) ?? 0
        if (score > previous) scores.set(iconIndex, score)
      }
    }

    for (const term of alternatives) {
      add(index.nameWords.get(term), term === queryWord ? 100 : 74)
      const prefixScore = term === queryWord ? 82 : 62
      for (const name of index.nameVocabulary) {
        if (name !== term && name.startsWith(term)) add(index.nameWords.get(name), prefixScore)
      }
      add(index.allWords.get(term), term === queryWord ? 58 : 44)
    }

    if (queryWord.length >= 4) {
      const limit = queryWord.length > 7 ? 2 : 1
      const candidates = new Set<number>()
      for (const word of index.allVocabulary) {
        if (word !== queryWord && editDistance(queryWord, word) <= limit) {
          for (const iconIndex of index.allWords.get(word) ?? []) candidates.add(iconIndex)
        }
      }
      for (const iconIndex of candidates) {
        if (!scores.has(iconIndex)) scores.set(iconIndex, 24)
      }
    }

    if (ranked.size === 0 && alternatives === termsByWord[0]) {
      ranked = scores
    } else {
      for (const [iconIndex, score] of ranked) {
        const nextScore = scores.get(iconIndex)
        if (nextScore === undefined) ranked.delete(iconIndex)
        else ranked.set(iconIndex, score + nextScore)
      }
    }
    if (ranked.size === 0) return []
  }

  return [...ranked]
    .map(([iconIndex, score]) => ({ icon: icons[iconIndex], score: score / termsByWord.length }))
    .sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name))
}
