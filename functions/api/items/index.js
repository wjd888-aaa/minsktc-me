export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  const category = url.searchParams.get('category')
  const type = url.searchParams.get('type')
  const metro = url.searchParams.get('metro')
  const search = url.searchParams.get('search')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

  if (request.method === 'GET') {
    let sql = 'SELECT * FROM items WHERE 1=1'
    const params = []

    if (category) { sql += ' AND category = ?'; params.push(category) }
    if (type) { sql += ' AND type = ?'; params.push(type) }
    if (metro) { sql += ' AND metro = ?'; params.push(metro) }
    if (search) { sql += ' AND title LIKE ?'; params.push(`%${search}%`) }

    sql += ' ORDER BY createdAt DESC LIMIT ?'
    params.push(limit)

    const result = await env.DB.prepare(sql).bind(...params).all()
    const items = result.results.map(item => {
      const { deleteToken, ...rest } = item
      return { ...rest, images: JSON.parse(rest.images || '[]') }
    })

    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const now = new Date().toISOString()
    const deleteToken = crypto.randomUUID()

    const result = await env.DB.prepare(
      'INSERT INTO items (title, category, type, price, description, contact, images, metro, address, deleteToken, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      deleteToken,
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
      deleteToken,
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
