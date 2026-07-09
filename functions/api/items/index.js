export async function onRequest(context) {
  const { request, data } = context
  const url = new URL(request.url)
  const { dataApi } = data

  const category = url.searchParams.get('category')
  const type = url.searchParams.get('type')
  const search = url.searchParams.get('search')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)

  if (request.method === 'GET') {
    const query = {}
    if (category) query.category = category
    if (type) query.type = type
    if (search) query.title = { $regex: search, $options: 'i' }

    const result = await dataApi('find', 'items', {
      filter: query,
      sort: { createdAt: -1 },
      limit
    })

    return new Response(JSON.stringify(result.documents || result), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const doc = {
      title: body.title,
      category: body.category,
      type: body.type || 'sell',
      price: parseFloat(body.price) || 0,
      description: body.description,
      contact: body.contact || '',
      images: body.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await dataApi('insertOne', 'items', { document: doc })
    return new Response(JSON.stringify({ _id: result.insertedId, ...doc }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
