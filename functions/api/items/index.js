export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  const category = url.searchParams.get('category')
  const type = url.searchParams.get('type')
  const metro = url.searchParams.get('metro')
  const search = url.searchParams.get('search')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

  if (request.method === 'GET') {
    let sql = 'SELECT i.*, (SELECT COUNT(*) FROM comments c WHERE c.itemId = i.id) AS commentCount FROM items i WHERE 1=1'
    const params = []

    if (category === 'food') { sql += ' AND i.category IN (?, ?)'; params.push('food', 'seasoning') }
    else if (category) { sql += ' AND i.category = ?'; params.push(category) }
    if (type) { sql += ' AND i.type = ?'; params.push(type) }
    if (metro) { sql += ' AND i.metro = ?'; params.push(metro) }
    if (search) { sql += ' AND i.title LIKE ?'; params.push(`%${search}%`) }

    sql += ' ORDER BY i.createdAt DESC LIMIT ?'
    params.push(limit)

    const result = await env.DB.prepare(sql).bind(...params).all()
    const items = result.results.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]')
    }))

    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const now = new Date().toISOString()

    const phone = body.phone || ''

    const result = await env.DB.prepare(
      'INSERT INTO items (title, category, type, price, description, contact, images, metro, address, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      body.title,
      body.category,
      body.type || 'sell',
      parseFloat(body.price) || 0,
      body.description || '',
      body.contact || '',
      JSON.stringify(body.images || []),
      body.metro || '',
      body.address || '',
      phone,
      now,
      now
    ).run()

    const newItem = {
      id: result.meta.last_row_id,
      title: body.title,
      category: body.category,
      type: body.type || 'sell',
      price: parseFloat(body.price) || 0,
      description: body.description || '',
      contact: body.contact || '',
      images: body.images || [],
      metro: body.metro || '',
      address: body.address || '',
      phone: phone,
      createdAt: now,
      updatedAt: now
    }

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
