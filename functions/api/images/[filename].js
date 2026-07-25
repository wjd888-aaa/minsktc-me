export async function onRequest(context) {
  const { env, params } = context
  const filename = params.filename

  const object = await env.IMAGES_BUCKET.get(filename)

  if (!object) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg')
  headers.set('Cache-Control', 'public, max-age=31536000')
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(object.body, { headers })
}
