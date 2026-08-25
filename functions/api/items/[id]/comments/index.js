export async function onRequest(context) {
  const { request, env, params } = context
  const id = parseInt(params.id)
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers })
  }

  if (request.method === 'GET') {
    const result = await env.DB.prepare(
      'SELECT * FROM comments WHERE itemId = ? ORDER BY createdAt DESC'
    ).bind(id).all()
    return new Response(JSON.stringify(result.results), { headers })
  }

  if (request.method === 'POST') {
    const item = await env.DB.prepare('SELECT id FROM items WHERE id = ?').bind(id).first()
    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers })
    }

    const body = await request.json()
    const content = (body.content || '').trim()
    if (!content) {
      return new Response(JSON.stringify({ error: '留言内容不能为空' }), { status: 400, headers })
    }
    if (content.length > 500) {
      return new Response(JSON.stringify({ error: '留言内容过长（最多500字）' }), { status: 400, headers })
    }

    const name = (body.name || '').trim().slice(0, 20) || '匿名'
    const now = new Date().toISOString()

    const result = await env.DB.prepare(
      'INSERT INTO comments (itemId, name, content, createdAt) VALUES (?, ?, ?, ?)'
    ).bind(id, name, content, now).run()

    const comment = {
      id: result.meta.last_row_id,
      itemId: id,
      name,
      content,
      createdAt: now
    }

    return new Response(JSON.stringify(comment), { status: 201, headers })
  }

  return new Response('Method not allowed', { status: 405 })
}
