import {
  // Arrows
  ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, ArrowUp, CornerDownRight, CornerUpLeft, MoveDiagonal, Move, Undo2, Redo2, RefreshCw, Shuffle,
  // Brands / Open Ecosystem
  GitBranch, GitCommit, GitPullRequest, Code2, Terminal, Globe, Workflow, Atom, Component, Database,
  // Business
  Briefcase, Building2, TrendingUp, BarChart3, PieChart, Presentation, Wallet, Coins, DollarSign, Calculator,
  // Camera & Visual
  Camera, Video, Focus, Film, Aperture, Image, Sliders, Sparkles, Eye,
  // Commerce
  ShoppingBag, ShoppingCart, CreditCard, Tag, Package, Store, Receipt, Banknote, Truck, Gift,
  // Communication
  Mail, MessageSquare, MessageCircle, Phone, AtSign, Share2, Send, Inbox, Megaphone, Bell,
  // Design
  Palette, PenTool, Layers, Compass, Brush, Wand2, Scissors, Crop, Pipette,
  // Devices
  Laptop, Smartphone, Tablet, Monitor, Cpu, HardDrive, Wifi, Bluetooth, Headphones, Speaker,
  // Editing
  FileText, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Highlighter, Underline,
  // Nature
  Sun, Moon, Cloud, CloudRain, Flame, Leaf, Wind, Snowflake, Umbrella, TreePine,
  // People
  User, Users, UserPlus, UserCheck, HeartHandshake, Smile, Award, Heart,
  // Security
  Shield, ShieldCheck, ShieldAlert, Lock, Unlock, Key, Fingerprint, FileLock2,
  // System
  Settings, Power, Command, Search, Filter, Folder, Trash2, CheckCircle2, AlertCircle, Clock
} from 'lucide-react'
import type { CategoryItem, IconItem } from '../types'

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'cat-all', name: 'All Icons', count: 96, slug: 'all' },
  { id: 'cat-arrows', name: 'Arrows', count: 13, slug: 'arrows' },
  { id: 'cat-brands', name: 'Brands', count: 10, slug: 'brands' },
  { id: 'cat-business', name: 'Business', count: 10, slug: 'business' },
  { id: 'cat-camera', name: 'Camera', count: 9, slug: 'camera' },
  { id: 'cat-commerce', name: 'Commerce', count: 10, slug: 'commerce' },
  { id: 'cat-communication', name: 'Communication', count: 10, slug: 'communication' },
  { id: 'cat-design', name: 'Design', count: 9, slug: 'design' },
  { id: 'cat-devices', name: 'Devices', count: 10, slug: 'devices' },
  { id: 'cat-editing', name: 'Editing', count: 9, slug: 'editing' },
  { id: 'cat-nature', name: 'Nature', count: 10, slug: 'nature' },
  { id: 'cat-people', name: 'People', count: 8, slug: 'people' },
  { id: 'cat-security', name: 'Security', count: 8, slug: 'security' },
  { id: 'cat-system', name: 'System', count: 10, slug: 'system' },
]

export const MOCK_ICONS: IconItem[] = [
  // --- Arrows ---
  { id: 'arr-01', name: 'Arrow Up Right', category: 'Arrows', source: 'Lucide', style: 'stroke', license: 'MIT', component: ArrowUpRight, popularity: 98, tags: ['arrow', 'up', 'right', 'link', 'external', 'navigate'] },
  { id: 'arr-02', name: 'Arrow Right', category: 'Arrows', source: 'Phosphor', style: 'stroke', license: 'MIT', component: ArrowRight, popularity: 95, tags: ['arrow', 'right', 'next', 'forward', 'proceed'] },
  { id: 'arr-03', name: 'Arrow Left', category: 'Arrows', source: 'Tabler', style: 'stroke', license: 'MIT', component: ArrowLeft, popularity: 92, tags: ['arrow', 'left', 'back', 'previous', 'return'] },
  { id: 'arr-04', name: 'Arrow Down', category: 'Arrows', source: 'Heroicons', style: 'stroke', license: 'MIT', component: ArrowDown, popularity: 90, tags: ['arrow', 'down', 'bottom', 'download', 'expand'] },
  { id: 'arr-05', name: 'Arrow Up', category: 'Arrows', source: 'Simple Icons', style: 'stroke', license: 'CC BY 4.0', component: ArrowUp, popularity: 88, tags: ['arrow', 'up', 'top', 'upload', 'collapse'] },
  { id: 'arr-06', name: 'Corner Down Right', category: 'Arrows', source: 'Lucide', style: 'stroke', license: 'MIT', component: CornerDownRight, popularity: 82, tags: ['corner', 'down', 'right', 'reply', 'turn'] },
  { id: 'arr-07', name: 'Corner Up Left', category: 'Arrows', source: 'Phosphor', style: 'stroke', license: 'MIT', component: CornerUpLeft, popularity: 80, tags: ['corner', 'up', 'left', 'hook', 'curve'] },
  { id: 'arr-08', name: 'Move Diagonal', category: 'Arrows', source: 'Tabler', style: 'stroke', license: 'MIT', component: MoveDiagonal, popularity: 76, tags: ['move', 'diagonal', 'resize', 'transform'] },
  { id: 'arr-09', name: 'Move', category: 'Arrows', source: 'Lucide', style: 'stroke', license: 'MIT', component: Move, popularity: 79, tags: ['move', 'arrows', 'drag', 'position', 'pan'] },
  { id: 'arr-10', name: 'Undo 2', category: 'Arrows', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Undo2, popularity: 89, tags: ['undo', 'history', 'revert', 'back', 'arrow'] },
  { id: 'arr-11', name: 'Redo 2', category: 'Arrows', source: 'Lucide', style: 'stroke', license: 'MIT', component: Redo2, popularity: 86, tags: ['redo', 'forward', 'repeat', 'history'] },
  { id: 'arr-12', name: 'Refresh CW', category: 'Arrows', source: 'Phosphor', style: 'stroke', license: 'MIT', component: RefreshCw, popularity: 94, tags: ['refresh', 'reload', 'sync', 'update', 'cw'] },
  { id: 'arr-13', name: 'Shuffle', category: 'Arrows', source: 'Tabler', style: 'stroke', license: 'MIT', component: Shuffle, popularity: 81, tags: ['shuffle', 'random', 'music', 'mix', 'arrows'] },

  // --- Brands & Open Ecosystem ---
  { id: 'brn-01', name: 'Git Branch', category: 'Brands', source: 'Lucide', style: 'stroke', license: 'MIT', component: GitBranch, popularity: 94, tags: ['git', 'branch', 'version', 'code', 'vcs', 'developer'] },
  { id: 'brn-02', name: 'Git Commit', category: 'Brands', source: 'Tabler', style: 'stroke', license: 'MIT', component: GitCommit, popularity: 91, tags: ['git', 'commit', 'hash', 'code', 'record'] },
  { id: 'brn-03', name: 'Git Pull Request', category: 'Brands', source: 'Phosphor', style: 'stroke', license: 'MIT', component: GitPullRequest, popularity: 96, tags: ['git', 'pr', 'merge', 'pull', 'review'] },
  { id: 'brn-04', name: 'Code 2', category: 'Brands', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Code2, popularity: 97, tags: ['code', 'html', 'developer', 'xml', 'programming'] },
  { id: 'brn-05', name: 'Terminal', category: 'Brands', source: 'Simple Icons', style: 'stroke', license: 'Apache 2.0', component: Terminal, popularity: 93, tags: ['terminal', 'cli', 'console', 'bash', 'shell'] },
  { id: 'brn-06', name: 'Globe Network', category: 'Brands', source: 'Lucide', style: 'stroke', license: 'MIT', component: Globe, popularity: 92, tags: ['globe', 'web', 'internet', 'earth', 'world'] },
  { id: 'brn-07', name: 'Workflow', category: 'Brands', source: 'Tabler', style: 'stroke', license: 'MIT', component: Workflow, popularity: 88, tags: ['workflow', 'automation', 'diagram', 'pipeline'] },
  { id: 'brn-08', name: 'Atom Core', category: 'Brands', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Atom, popularity: 87, tags: ['atom', 'react', 'science', 'physics', 'orbit'] },
  { id: 'brn-09', name: 'Component UI', category: 'Brands', source: 'Lucide', style: 'stroke', license: 'MIT', component: Component, popularity: 89, tags: ['component', 'figma', 'layer', 'design-system', 'symbol'] },
  { id: 'brn-10', name: 'Database Cloud', category: 'Brands', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Database, popularity: 90, tags: ['database', 'sql', 'storage', 'postgres', 'server'] },

  // --- Business ---
  { id: 'bus-01', name: 'Briefcase', category: 'Business', source: 'Lucide', style: 'stroke', license: 'MIT', component: Briefcase, popularity: 91, tags: ['briefcase', 'work', 'job', 'business', 'portfolio'] },
  { id: 'bus-02', name: 'Building 2', category: 'Business', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Building2, popularity: 89, tags: ['building', 'office', 'company', 'corporate', 'real-estate'] },
  { id: 'bus-03', name: 'Trending Up', category: 'Business', source: 'Tabler', style: 'stroke', license: 'MIT', component: TrendingUp, popularity: 97, tags: ['trending', 'up', 'growth', 'analytics', 'profit', 'stock'] },
  { id: 'bus-04', name: 'Bar Chart 3', category: 'Business', source: 'Heroicons', style: 'stroke', license: 'MIT', component: BarChart3, popularity: 95, tags: ['chart', 'bar', 'analytics', 'statistics', 'graph'] },
  { id: 'bus-05', name: 'Pie Chart', category: 'Business', source: 'Simple Icons', style: 'stroke', license: 'Apache 2.0', component: PieChart, popularity: 85, tags: ['chart', 'pie', 'slice', 'ratio', 'data'] },
  { id: 'bus-06', name: 'Presentation', category: 'Business', source: 'Lucide', style: 'stroke', license: 'MIT', component: Presentation, popularity: 84, tags: ['presentation', 'slides', 'meeting', 'lecture', 'screen'] },
  { id: 'bus-07', name: 'Wallet', category: 'Business', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Wallet, popularity: 93, tags: ['wallet', 'money', 'crypto', 'payment', 'finance'] },
  { id: 'bus-08', name: 'Coins', category: 'Business', source: 'Tabler', style: 'stroke', license: 'MIT', component: Coins, popularity: 88, tags: ['coins', 'currency', 'cash', 'savings', 'gold'] },
  { id: 'bus-09', name: 'Dollar Sign', category: 'Business', source: 'Heroicons', style: 'stroke', license: 'MIT', component: DollarSign, popularity: 92, tags: ['dollar', 'usd', 'price', 'cost', 'money'] },
  { id: 'bus-10', name: 'Calculator', category: 'Business', source: 'Lucide', style: 'stroke', license: 'MIT', component: Calculator, popularity: 82, tags: ['calculator', 'math', 'accounting', 'budget'] },

  // --- Camera & Visual ---
  { id: 'cam-01', name: 'Camera Lens', category: 'Camera', source: 'Lucide', style: 'stroke', license: 'MIT', component: Camera, popularity: 96, tags: ['camera', 'photo', 'picture', 'shutter', 'capture'] },
  { id: 'cam-02', name: 'Video Cam', category: 'Camera', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Video, popularity: 94, tags: ['video', 'record', 'film', 'movie', 'meeting'] },
  { id: 'cam-03', name: 'Focus Center', category: 'Camera', source: 'Tabler', style: 'stroke', license: 'MIT', component: Focus, popularity: 83, tags: ['focus', 'target', 'lens', 'reticle', 'aim'] },
  { id: 'cam-04', name: 'Film Strip', category: 'Camera', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Film, popularity: 79, tags: ['film', 'cinema', 'motion', 'tape', 'media'] },
  { id: 'cam-05', name: 'Aperture Blade', category: 'Camera', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Aperture, popularity: 86, tags: ['aperture', 'iris', 'optics', 'photography'] },
  { id: 'cam-06', name: 'Image Gallery', category: 'Camera', source: 'Lucide', style: 'stroke', license: 'MIT', component: Image, popularity: 95, tags: ['image', 'photo', 'picture', 'landscape', 'media'] },
  { id: 'cam-07', name: 'Sliders Equalizer', category: 'Camera', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Sliders, popularity: 88, tags: ['sliders', 'adjust', 'exposure', 'controls', 'tuning'] },
  { id: 'cam-08', name: 'Sparkles Filter', category: 'Camera', source: 'Tabler', style: 'stroke', license: 'MIT', component: Sparkles, popularity: 99, tags: ['sparkles', 'ai', 'magic', 'clean', 'enhance', 'stars'] },
  { id: 'cam-09', name: 'Eye View', category: 'Camera', source: 'Lucide', style: 'stroke', license: 'MIT', component: Eye, popularity: 92, tags: ['eye', 'visibility', 'preview', 'view', 'watch'] },

  // --- Commerce ---
  { id: 'com-01', name: 'Shopping Bag', category: 'Commerce', source: 'Lucide', style: 'stroke', license: 'MIT', component: ShoppingBag, popularity: 97, tags: ['bag', 'shopping', 'store', 'cart', 'retail'] },
  { id: 'com-02', name: 'Shopping Cart', category: 'Commerce', source: 'Phosphor', style: 'stroke', license: 'MIT', component: ShoppingCart, popularity: 98, tags: ['cart', 'ecommerce', 'checkout', 'buy'] },
  { id: 'com-03', name: 'Credit Card', category: 'Commerce', source: 'Tabler', style: 'stroke', license: 'MIT', component: CreditCard, popularity: 96, tags: ['credit', 'card', 'payment', 'visa', 'mastercard'] },
  { id: 'com-04', name: 'Price Tag', category: 'Commerce', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Tag, popularity: 91, tags: ['tag', 'price', 'discount', 'label', 'offer'] },
  { id: 'com-05', name: 'Package Box', category: 'Commerce', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Package, popularity: 93, tags: ['package', 'box', 'delivery', 'shipping', 'order'] },
  { id: 'com-06', name: 'Storefront', category: 'Commerce', source: 'Lucide', style: 'stroke', license: 'MIT', component: Store, popularity: 87, tags: ['store', 'shop', 'market', 'vendor', 'retail'] },
  { id: 'com-07', name: 'Receipt Invoice', category: 'Commerce', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Receipt, popularity: 84, tags: ['receipt', 'bill', 'invoice', 'order', 'transaction'] },
  { id: 'com-08', name: 'Banknote Cash', category: 'Commerce', source: 'Tabler', style: 'stroke', license: 'MIT', component: Banknote, popularity: 86, tags: ['banknote', 'cash', 'money', 'payment', 'paper'] },
  { id: 'com-09', name: 'Delivery Truck', category: 'Commerce', source: 'Lucide', style: 'stroke', license: 'MIT', component: Truck, popularity: 90, tags: ['truck', 'delivery', 'transport', 'shipping', 'freight'] },
  { id: 'com-10', name: 'Gift Box', category: 'Commerce', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Gift, popularity: 89, tags: ['gift', 'present', 'reward', 'bonus', 'holiday'] },

  // --- Communication ---
  { id: 'cmn-01', name: 'Mail Envelope', category: 'Communication', source: 'Lucide', style: 'stroke', license: 'MIT', component: Mail, popularity: 99, tags: ['mail', 'email', 'message', 'inbox', 'letter'] },
  { id: 'cmn-02', name: 'Message Square', category: 'Communication', source: 'Phosphor', style: 'stroke', license: 'MIT', component: MessageSquare, popularity: 95, tags: ['message', 'chat', 'bubble', 'comment', 'discuss'] },
  { id: 'cmn-03', name: 'Message Circle', category: 'Communication', source: 'Tabler', style: 'stroke', license: 'MIT', component: MessageCircle, popularity: 93, tags: ['message', 'talk', 'chat', 'feedback', 'sms'] },
  { id: 'cmn-04', name: 'Phone Call', category: 'Communication', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Phone, popularity: 90, tags: ['phone', 'call', 'contact', 'telephone', 'mobile'] },
  { id: 'cmn-05', name: 'At Sign', category: 'Communication', source: 'Simple Icons', style: 'stroke', license: 'Apache 2.0', component: AtSign, popularity: 88, tags: ['at', 'mention', 'email', 'tag', 'username'] },
  { id: 'cmn-06', name: 'Share Network', category: 'Communication', source: 'Lucide', style: 'stroke', license: 'MIT', component: Share2, popularity: 94, tags: ['share', 'social', 'export', 'nodes', 'forward'] },
  { id: 'cmn-07', name: 'Send Arrow', category: 'Communication', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Send, popularity: 96, tags: ['send', 'submit', 'paperplane', 'fly', 'dispatch'] },
  { id: 'cmn-08', name: 'Inbox Tray', category: 'Communication', source: 'Tabler', style: 'stroke', license: 'MIT', component: Inbox, popularity: 87, tags: ['inbox', 'tray', 'messages', 'incoming', 'storage'] },
  { id: 'cmn-09', name: 'Megaphone', category: 'Communication', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Megaphone, popularity: 85, tags: ['megaphone', 'broadcast', 'marketing', 'announcement'] },
  { id: 'cmn-10', name: 'Bell Notification', category: 'Communication', source: 'Lucide', style: 'stroke', license: 'MIT', component: Bell, popularity: 98, tags: ['bell', 'alarm', 'notify', 'alert', 'reminder'] },

  // --- Design ---
  { id: 'dsg-01', name: 'Color Palette', category: 'Design', source: 'Lucide', style: 'stroke', license: 'MIT', component: Palette, popularity: 97, tags: ['palette', 'color', 'art', 'theme', 'paint'] },
  { id: 'dsg-02', name: 'Pen Tool', category: 'Design', source: 'Phosphor', style: 'stroke', license: 'MIT', component: PenTool, popularity: 93, tags: ['pen', 'vector', 'bezier', 'draw', 'illustrator'] },
  { id: 'dsg-03', name: 'Layers Stack', category: 'Design', source: 'Tabler', style: 'stroke', license: 'MIT', component: Layers, popularity: 96, tags: ['layers', 'artboard', 'hierarchy', 'stack', 'overlay'] },
  { id: 'dsg-04', name: 'Compass Vector', category: 'Design', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Compass, popularity: 86, tags: ['compass', 'geometry', 'measure', 'circle', 'drafting'] },
  { id: 'dsg-05', name: 'Paint Brush', category: 'Design', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Brush, popularity: 89, tags: ['brush', 'paint', 'stroke', 'canvas', 'creative'] },
  { id: 'dsg-06', name: 'Wand Magic', category: 'Design', source: 'Lucide', style: 'stroke', license: 'MIT', component: Wand2, popularity: 94, tags: ['wand', 'magic', 'ai', 'generate', 'creative'] },
  { id: 'dsg-07', name: 'Scissors Cut', category: 'Design', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Scissors, popularity: 81, tags: ['scissors', 'cut', 'trim', 'snip', 'clip'] },
  { id: 'dsg-08', name: 'Crop Frame', category: 'Design', source: 'Tabler', style: 'stroke', license: 'MIT', component: Crop, popularity: 84, tags: ['crop', 'aspect', 'frame', 'image', 'bounds'] },
  { id: 'dsg-09', name: 'Pipette Eyedropper', category: 'Design', source: 'Lucide', style: 'stroke', license: 'MIT', component: Pipette, popularity: 90, tags: ['pipette', 'eyedropper', 'sample', 'color', 'hex'] },

  // --- Devices ---
  { id: 'dev-01', name: 'Laptop Mac', category: 'Devices', source: 'Lucide', style: 'stroke', license: 'MIT', component: Laptop, popularity: 97, tags: ['laptop', 'macbook', 'computer', 'screen', 'device'] },
  { id: 'dev-02', name: 'Smartphone', category: 'Devices', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Smartphone, popularity: 98, tags: ['phone', 'mobile', 'iphone', 'cellular', 'screen'] },
  { id: 'dev-03', name: 'Tablet iPad', category: 'Devices', source: 'Tabler', style: 'stroke', license: 'MIT', component: Tablet, popularity: 89, tags: ['tablet', 'ipad', 'touch', 'device', 'screen'] },
  { id: 'dev-04', name: 'Monitor Display', category: 'Devices', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Monitor, popularity: 92, tags: ['monitor', 'screen', 'desktop', 'display', 'panel'] },
  { id: 'dev-05', name: 'CPU Processor', category: 'Devices', source: 'Simple Icons', style: 'stroke', license: 'Apache 2.0', component: Cpu, popularity: 95, tags: ['cpu', 'processor', 'silicon', 'hardware', 'chip'] },
  { id: 'dev-06', name: 'Hard Drive', category: 'Devices', source: 'Lucide', style: 'stroke', license: 'MIT', component: HardDrive, popularity: 86, tags: ['storage', 'disk', 'hdd', 'ssd', 'memory'] },
  { id: 'dev-07', name: 'Wi-Fi Signal', category: 'Devices', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Wifi, popularity: 96, tags: ['wifi', 'wireless', 'network', 'internet', 'connection'] },
  { id: 'dev-08', name: 'Bluetooth', category: 'Devices', source: 'Tabler', style: 'stroke', license: 'MIT', component: Bluetooth, popularity: 87, tags: ['bluetooth', 'wireless', 'sync', 'pair', 'connect'] },
  { id: 'dev-09', name: 'Headphones Audio', category: 'Devices', source: 'Lucide', style: 'stroke', license: 'MIT', component: Headphones, popularity: 91, tags: ['headphones', 'music', 'sound', 'audio', 'listen'] },
  { id: 'dev-10', name: 'Speaker Sound', category: 'Devices', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Speaker, popularity: 85, tags: ['speaker', 'audio', 'bass', 'loud', 'stereo'] },

  // --- Editing ---
  { id: 'edt-01', name: 'File Text', category: 'Editing', source: 'Lucide', style: 'stroke', license: 'MIT', component: FileText, popularity: 96, tags: ['file', 'text', 'document', 'page', 'doc'] },
  { id: 'edt-02', name: 'Type Typography', category: 'Editing', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Type, popularity: 92, tags: ['type', 'font', 'text', 'heading', 'character'] },
  { id: 'edt-03', name: 'Bold Text', category: 'Editing', source: 'Tabler', style: 'stroke', license: 'MIT', component: Bold, popularity: 89, tags: ['bold', 'weight', 'strong', 'format', 'typography'] },
  { id: 'edt-04', name: 'Italic Text', category: 'Editing', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Italic, popularity: 87, tags: ['italic', 'oblique', 'slant', 'format', 'text'] },
  { id: 'edt-05', name: 'Align Left', category: 'Editing', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: AlignLeft, popularity: 88, tags: ['align', 'left', 'paragraph', 'margin', 'layout'] },
  { id: 'edt-06', name: 'Align Center', category: 'Editing', source: 'Lucide', style: 'stroke', license: 'MIT', component: AlignCenter, popularity: 86, tags: ['align', 'center', 'middle', 'format', 'justify'] },
  { id: 'edt-07', name: 'Align Right', category: 'Editing', source: 'Phosphor', style: 'stroke', license: 'MIT', component: AlignRight, popularity: 85, tags: ['align', 'right', 'paragraph', 'format'] },
  { id: 'edt-08', name: 'Highlighter', category: 'Editing', source: 'Tabler', style: 'stroke', license: 'MIT', component: Highlighter, popularity: 83, tags: ['highlighter', 'marker', 'note', 'color', 'emphasis'] },
  { id: 'edt-09', name: 'Underline Text', category: 'Editing', source: 'Lucide', style: 'stroke', license: 'MIT', component: Underline, popularity: 84, tags: ['underline', 'format', 'text', 'decoration', 'rule'] },

  // --- Nature ---
  { id: 'nat-01', name: 'Sun Bright', category: 'Nature', source: 'Lucide', style: 'stroke', license: 'MIT', component: Sun, popularity: 98, tags: ['sun', 'day', 'light', 'bright', 'weather', 'summer'] },
  { id: 'nat-02', name: 'Moon Night', category: 'Nature', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Moon, popularity: 97, tags: ['moon', 'night', 'dark', 'crescent', 'theme'] },
  { id: 'nat-03', name: 'Cloud Weather', category: 'Nature', source: 'Tabler', style: 'stroke', license: 'MIT', component: Cloud, popularity: 93, tags: ['cloud', 'weather', 'sky', 'overcast', 'storage'] },
  { id: 'nat-04', name: 'Cloud Rain', category: 'Nature', source: 'Heroicons', style: 'stroke', license: 'MIT', component: CloudRain, popularity: 89, tags: ['rain', 'shower', 'storm', 'water', 'weather'] },
  { id: 'nat-05', name: 'Flame Fire', category: 'Nature', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Flame, popularity: 96, tags: ['flame', 'fire', 'hot', 'trending', 'burn', 'warmth'] },
  { id: 'nat-06', name: 'Leaf Organic', category: 'Nature', source: 'Lucide', style: 'stroke', license: 'MIT', component: Leaf, popularity: 91, tags: ['leaf', 'plant', 'nature', 'eco', 'green', 'environment'] },
  { id: 'nat-07', name: 'Wind Breeze', category: 'Nature', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Wind, popularity: 85, tags: ['wind', 'air', 'breeze', 'weather', 'blow'] },
  { id: 'nat-08', name: 'Snowflake Crystal', category: 'Nature', source: 'Tabler', style: 'stroke', license: 'MIT', component: Snowflake, popularity: 88, tags: ['snow', 'winter', 'cold', 'ice', 'freeze'] },
  { id: 'nat-09', name: 'Umbrella Protection', category: 'Nature', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Umbrella, popularity: 84, tags: ['umbrella', 'rain', 'protect', 'cover', 'weather'] },
  { id: 'nat-10', name: 'Pine Tree', category: 'Nature', source: 'Lucide', style: 'stroke', license: 'MIT', component: TreePine, popularity: 86, tags: ['tree', 'forest', 'pine', 'wood', 'nature'] },

  // --- People ---
  { id: 'ppl-01', name: 'User Single', category: 'People', source: 'Lucide', style: 'stroke', license: 'MIT', component: User, popularity: 99, tags: ['user', 'person', 'profile', 'account', 'avatar'] },
  { id: 'ppl-02', name: 'Users Group', category: 'People', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Users, popularity: 97, tags: ['users', 'team', 'group', 'community', 'collaborate'] },
  { id: 'ppl-03', name: 'User Plus', category: 'People', source: 'Tabler', style: 'stroke', license: 'MIT', component: UserPlus, popularity: 92, tags: ['user', 'add', 'invite', 'new', 'member'] },
  { id: 'ppl-04', name: 'User Check', category: 'People', source: 'Heroicons', style: 'stroke', license: 'MIT', component: UserCheck, popularity: 90, tags: ['user', 'verified', 'approved', 'check', 'valid'] },
  { id: 'ppl-05', name: 'Heart Handshake', category: 'People', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: HeartHandshake, popularity: 93, tags: ['deal', 'partnership', 'handshake', 'trust', 'agreement'] },
  { id: 'ppl-06', name: 'Smile Face', category: 'People', source: 'Lucide', style: 'stroke', license: 'MIT', component: Smile, popularity: 88, tags: ['smile', 'happy', 'emoji', 'rating', 'feedback'] },
  { id: 'ppl-07', name: 'Award Medal', category: 'People', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Award, popularity: 91, tags: ['award', 'badge', 'honor', 'winner', 'trophy'] },
  { id: 'ppl-08', name: 'Heart Favorite', category: 'People', source: 'Tabler', style: 'stroke', license: 'MIT', component: Heart, popularity: 98, tags: ['heart', 'love', 'like', 'favorite', 'bookmark'] },

  // --- Security ---
  { id: 'sec-01', name: 'Shield Safe', category: 'Security', source: 'Lucide', style: 'stroke', license: 'MIT', component: Shield, popularity: 97, tags: ['shield', 'secure', 'protect', 'guard', 'defense'] },
  { id: 'sec-02', name: 'Shield Check', category: 'Security', source: 'Phosphor', style: 'stroke', license: 'MIT', component: ShieldCheck, popularity: 98, tags: ['shield', 'verified', 'secure', 'safe', 'pass'] },
  { id: 'sec-03', name: 'Shield Alert', category: 'Security', source: 'Tabler', style: 'stroke', license: 'MIT', component: ShieldAlert, popularity: 89, tags: ['shield', 'warning', 'risk', 'danger', 'alert'] },
  { id: 'sec-04', name: 'Lock Closed', category: 'Security', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Lock, popularity: 99, tags: ['lock', 'secure', 'private', 'password', 'closed'] },
  { id: 'sec-05', name: 'Unlock Open', category: 'Security', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Unlock, popularity: 88, tags: ['unlock', 'open', 'public', 'access', 'grant'] },
  { id: 'sec-06', name: 'Key Access', category: 'Security', source: 'Lucide', style: 'stroke', license: 'MIT', component: Key, popularity: 94, tags: ['key', 'secret', 'token', 'auth', 'login'] },
  { id: 'sec-07', name: 'Fingerprint Biometric', category: 'Security', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Fingerprint, popularity: 92, tags: ['fingerprint', 'biometrics', 'identity', 'touch', 'sensor'] },
  { id: 'sec-08', name: 'File Lock', category: 'Security', source: 'Tabler', style: 'stroke', license: 'MIT', component: FileLock2, popularity: 85, tags: ['file', 'lock', 'encrypted', 'secure', 'vault'] },

  // --- System ---
  { id: 'sys-01', name: 'Settings Cog', category: 'System', source: 'Lucide', style: 'stroke', license: 'MIT', component: Settings, popularity: 99, tags: ['settings', 'cog', 'gear', 'config', 'preferences'] },
  { id: 'sys-02', name: 'Power Switch', category: 'System', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Power, popularity: 90, tags: ['power', 'shutdown', 'on', 'off', 'restart'] },
  { id: 'sys-03', name: 'Command Cmd', category: 'System', source: 'Tabler', style: 'stroke', license: 'MIT', component: Command, popularity: 95, tags: ['command', 'cmd', 'keyboard', 'shortcut', 'mac'] },
  { id: 'sys-04', name: 'Search Lens', category: 'System', source: 'Heroicons', style: 'stroke', license: 'MIT', component: Search, popularity: 99, tags: ['search', 'find', 'lookup', 'magnifier', 'query'] },
  { id: 'sys-05', name: 'Filter Funnel', category: 'System', source: 'Simple Icons', style: 'stroke', license: 'MIT', component: Filter, popularity: 94, tags: ['filter', 'funnel', 'sort', 'refine', 'narrow'] },
  { id: 'sys-06', name: 'Folder Directory', category: 'System', source: 'Lucide', style: 'stroke', license: 'MIT', component: Folder, popularity: 96, tags: ['folder', 'directory', 'files', 'archive', 'storage'] },
  { id: 'sys-07', name: 'Trash Delete', category: 'System', source: 'Phosphor', style: 'stroke', license: 'MIT', component: Trash2, popularity: 93, tags: ['trash', 'delete', 'remove', 'bin', 'recycle'] },
  { id: 'sys-08', name: 'Check Verified', category: 'System', source: 'Tabler', style: 'stroke', license: 'MIT', component: CheckCircle2, popularity: 98, tags: ['check', 'success', 'done', 'approved', 'pass'] },
  { id: 'sys-09', name: 'Alert Warning', category: 'System', source: 'Heroicons', style: 'stroke', license: 'MIT', component: AlertCircle, popularity: 95, tags: ['alert', 'warning', 'error', 'notice', 'caution'] },
  { id: 'sys-10', name: 'Clock Time', category: 'System', source: 'Lucide', style: 'stroke', license: 'MIT', component: Clock, popularity: 96, tags: ['clock', 'time', 'recent', 'history', 'schedule'] },
]

export const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  Lucide: { bg: '#F1F1F3', text: '#0F1116' },
  Phosphor: { bg: '#EDE9FE', text: '#6D28D9' },
  Tabler: { bg: '#E0F2FE', text: '#0369A1' },
  Heroicons: { bg: '#DCFCE7', text: '#15803D' },
  'Simple Icons': { bg: '#FEF3C7', text: '#B45309' },
}
