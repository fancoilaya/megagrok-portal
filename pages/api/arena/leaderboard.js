import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
})

export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const key = `arena:daily:${today}`

    const raw = await redis.zrange(key, 0, 24, { rev: true })

    const leaderboard = raw.map((item, index) => ({
      rank: index + 1,
      ...item
    }))

    res.status(200).json({ leaderboard })
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ error: err.message })
  }
}
