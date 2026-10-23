export interface IconPack {
  id: string
  title: string
  description: string
  count: number
  coverGradient: string
  accentColor: string
  iconIds: string[]
  tags: string[]
}

export const MOCK_PACKS: IconPack[] = [
  {
    id: 'pack-essential-ui',
    title: 'Essential Interface',
    description: 'Core navigational, system and action glyphs engineered for modern web apps.',
    count: 24,
    coverGradient: 'linear-gradient(135deg, #7141E8 0%, #9D74FF 100%)',
    accentColor: '#7141E8',
    iconIds: [
      'sys-01', 'sys-04', 'sys-05', 'sys-06', 'sys-07', 'sys-08', 'sys-09', 'sys-10',
      'arr-01', 'arr-02', 'arr-03', 'arr-04', 'arr-10', 'arr-12', 'cmn-01', 'cmn-02',
      'cmn-07', 'cmn-10', 'ppl-01', 'ppl-02', 'sec-01', 'sec-04', 'dev-01', 'dev-02'
    ],
    tags: ['ui', 'navigation', 'interface', 'system']
  },
  {
    id: 'pack-ecommerce',
    title: 'Commerce & Retail',
    description: 'Checkout flows, currencies, receipts, delivery logistics, and shopping tags.',
    count: 14,
    coverGradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    accentColor: '#059669',
    iconIds: [
      'com-01', 'com-02', 'com-03', 'com-04', 'com-05', 'com-06', 'com-07', 'com-08',
      'com-09', 'com-10', 'bus-07', 'bus-08', 'bus-09', 'bus-10'
    ],
    tags: ['commerce', 'money', 'shop', 'retail', 'payment']
  },
  {
    id: 'pack-dev-cloud',
    title: 'Developer & Cloud',
    description: 'Version control, APIs, terminals, databases, and microservice infrastructure.',
    count: 16,
    coverGradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
    accentColor: '#D97706',
    iconIds: [
      'brn-01', 'brn-02', 'brn-03', 'brn-04', 'brn-05', 'brn-06', 'brn-07', 'brn-08',
      'brn-09', 'brn-10', 'dev-05', 'dev-06', 'dev-07', 'sys-03', 'sec-06', 'sec-08'
    ],
    tags: ['code', 'developer', 'cloud', 'database', 'git']
  },
  {
    id: 'pack-creative-media',
    title: 'Studio & Media',
    description: 'Precision vectors for video editing, photo capture, audio, and visual design.',
    count: 15,
    coverGradient: 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)',
    accentColor: '#E11D48',
    iconIds: [
      'cam-01', 'cam-02', 'cam-03', 'cam-04', 'cam-05', 'cam-06', 'cam-07', 'cam-08',
      'cam-09', 'dsg-01', 'dsg-02', 'dsg-03', 'dsg-05', 'dsg-06', 'dev-09'
    ],
    tags: ['media', 'camera', 'photo', 'design', 'art']
  },
  {
    id: 'pack-security-auth',
    title: 'Security & Access',
    description: 'Biometrics, cryptography, shield verifications, and permission controls.',
    count: 12,
    coverGradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    accentColor: '#0284C7',
    iconIds: [
      'sec-01', 'sec-02', 'sec-03', 'sec-04', 'sec-05', 'sec-06', 'sec-07', 'sec-08',
      'ppl-04', 'sys-08', 'sys-09', 'dev-08'
    ],
    tags: ['security', 'lock', 'shield', 'auth', 'protection']
  },
  {
    id: 'pack-nature-climate',
    title: 'Climate & Nature',
    description: 'Atmospheric conditions, day/night cycles, renewable energy, and vegetation.',
    count: 10,
    coverGradient: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)',
    accentColor: '#0D9488',
    iconIds: [
      'nat-01', 'nat-02', 'nat-03', 'nat-04', 'nat-05', 'nat-06', 'nat-07', 'nat-08',
      'nat-09', 'nat-10'
    ],
    tags: ['weather', 'nature', 'sun', 'cloud', 'environment']
  }
]
