export async function onRequest(context) {
  const { request, env, next } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  context.data.dataApi = async (action, collection, body) => {
    const res = await fetch(`${env.MONGO_DATA_API_URL}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': env.MONGO_DATA_API_KEY
      },
      body: JSON.stringify({
        dataSource: 'MinskTC',
        database: 'minsktc',
        collection,
        ...body
      })
    })
    return res.json()
  }

  return next()
}
