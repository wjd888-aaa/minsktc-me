const CATEGORIES = [
  { key: 'electronics', name: '电子产品', icon: '📱' },
  { key: 'furniture', name: '家具日用', icon: '🛋️' },
  { key: 'clothing', name: '服装鞋包', icon: '👗' },
  { key: 'books', name: '教材书籍', icon: '📚' },
  { key: 'rental', name: '房屋出租', icon: '🏠' },
  { key: 'service', name: '生活服务', icon: '🔧' }
]

export async function onRequest(context) {
  return new Response(JSON.stringify(CATEGORIES), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}
