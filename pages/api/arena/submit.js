import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405 }
    )
  }

  try {
    const body = await req.json()
    const { wallet, name, score, wave, kills } = body

    if (!wallet || typeof score !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)
    const key = `arena:daily:${today}`

    const entry = {
      wallet,
      name: name || 'Anonymous',
      score,
      wave: wave || 0,
      kills: kills || 0,
      ts: Date.now()
    }

    await kv.zadd(key, {
      score,
      member: JSON.stringify(entry)
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Submit error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500 }
    )
  }
}
