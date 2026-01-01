import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const key = `arena:daily:${today}`

    // Top 25 scores, highest first
    const raw = await kv.zrange(key, 0, 24, { rev: true })

    const leaderboard = raw.map((item, index) => {
      const data = JSON.parse(item)
      return {
        rank: index + 1,
        ...data
      }
    })

    return res.status(200).json({ leaderboard })
  } catch (err) {
    console.error('Leaderboard error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
