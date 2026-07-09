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
    await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run()
    return new Response(JSON.stringify({ deleted: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
