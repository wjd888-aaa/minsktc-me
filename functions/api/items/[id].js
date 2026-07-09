export async function onRequest(context) {
  const { request, data, params } = context
  const { dataApi } = data

  if (request.method === 'GET') {
    const result = await dataApi('findOne', 'items', {
      filter: { _id: { $oid: params.id } }
    })
    const doc = result.document
    if (!doc) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    }
    return new Response(JSON.stringify(doc), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'DELETE') {
    await dataApi('deleteOne', 'items', {
      filter: { _id: { $oid: params.id } }
    })
    return new Response(JSON.stringify({ deleted: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
