import { kv } from '@vercel/kv'

export const runtime = 'edge'

export default async function handler() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const key = `arena:daily:${today}`

    const raw = await kv.zrange(key, 0, 24, { rev: true })

    const leaderboard = raw.map((item, index) => {
      const data = JSON.parse(item)
      return {
        rank: index + 1,
        ...data
      }
    })

    return new Response(
      JSON.stringify({ leaderboard }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Leaderboard error', err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500 }
    )
  }
}
