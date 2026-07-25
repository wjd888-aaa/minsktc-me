export async function onRequest(context) {
  const { request, env, params } = context
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  }

  if (request.method === 'GET') {
    const item = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first()
    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }
    item.images = JSON.parse(item.images || '[]')
    return new Response(JSON.stringify(item), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'DELETE') {
    const item = await env.DB.prepare('SELECT phone, contact FROM items WHERE id = ?').bind(id).first()
    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }

    const url = new URL(request.url)
    const callerPhone = url.searchParams.get('phone') || ''
    if (!callerPhone || (item.phone !== callerPhone && item.contact !== callerPhone)) {
      return new Response(JSON.stringify({ error: '无权限删除' }), { status: 403, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }

    await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run()
    return new Response(JSON.stringify({ deleted: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'PATCH') {
    const item = await env.DB.prepare('SELECT phone, contact FROM items WHERE id = ?').bind(id).first()
    if (!item) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }

    const body = await request.json()
    const callerPhone = body.phone || ''
    if (!callerPhone || (item.phone !== callerPhone && item.contact !== callerPhone)) {
      return new Response(JSON.stringify({ error: '无权限编辑' }), { status: 403, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }

    const now = new Date().toISOString()
    await env.DB.prepare(
      `UPDATE items SET title = ?, category = ?, type = ?, price = ?, description = ?, contact = ?, images = ?, metro = ?, address = ?, phone = ?, updatedAt = ? WHERE id = ?`
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
      callerPhone,
      now,
      id
    ).run()

    const updated = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first()
    updated.images = JSON.parse(updated.images || '[]')
    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
