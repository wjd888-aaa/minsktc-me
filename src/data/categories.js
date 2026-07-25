const MAIN_CATEGORIES = [
  { key: 'digital',     name: '数码',   icon: '💻' },
  { key: 'furniture',   name: '家具',   icon: '🛋️' },
  { key: 'appliance',   name: '家电',   icon: '📺' },
  { key: 'textile',     name: '家纺',   icon: '🧵' },
  { key: 'menswear',    name: '男装',   icon: '👔' },
  { key: 'womenswear',  name: '女装',   icon: '👗' },
  { key: 'shoes',       name: '鞋靴',   icon: '👟' },
  { key: 'accessory',   name: '饰品',   icon: '💍' },
  { key: 'luggage',     name: '箱包',   icon: '🧳' },
  { key: 'sports',      name: '运动',   icon: '⚽' },
  { key: 'medicine',    name: '医药',   icon: '💊' },
  { key: 'food',        name: '食品',   icon: '🍜' },
  { key: 'seasoning',   name: '调料',   icon: '🌶️' },
  { key: 'toiletries',  name: '洗护',   icon: '🧴' },
  { key: 'beauty',      name: '美妆',   icon: '💄' },
  { key: 'instrument',  name: '乐器',   icon: '🎵' },
  { key: 'books',       name: '书籍',   icon: '📚' },
  { key: 'camping',     name: '露营',   icon: '⛺' },
  { key: 'gift',         name: '礼品',   icon: '🎁' }
]

const EXTRA_CATEGORIES = [
  { key: 'service',     name: '服务',   icon: '🔧' },
  { key: 'rental',      name: '租房',   icon: '🏠' }
]

const ALL_CATEGORIES = [...MAIN_CATEGORIES, ...EXTRA_CATEGORIES]

const LEGACY_MAP = {
  electronics:  '数码',
  clothing:     '男装',
  'furniture': '家具',
  beauty:       '美妆',
  instrument:   '乐器',
  books:        '书籍',
  rental:       '租房',
  service:      '服务'
}

function getCategoryName(key) {
  if (!key) return ''
  const found = ALL_CATEGORIES.find(c => c.key === key)
  if (found) return found.name
  return LEGACY_MAP[key] || key
}

export { MAIN_CATEGORIES, EXTRA_CATEGORIES, ALL_CATEGORIES, getCategoryName }