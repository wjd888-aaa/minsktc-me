export async function onRequest(context) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) {
    return new Response(JSON.stringify({ error: '未选择文件' }), {
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  if (file.size > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: '文件超过 10MB 限制' }), {
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  const ext = (file.name && file.name.split('.').pop()) || 'jpg'
  const filename = `${crypto.randomUUID()}.${ext}`

  await env.IMAGES_BUCKET.put(filename, file.stream(), {
    httpMetadata: { contentType: file.type || 'image/jpeg' }
  })

  return new Response(JSON.stringify({ url: `/api/images/${filename}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}
