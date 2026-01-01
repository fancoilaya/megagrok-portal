import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { wallet, name, score, wave, kills } = req.body

    if (!wallet || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' })
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

    // Use score as the sorted-set score
    await kv.zadd(key, {
      score,
      member: JSON.stringify(entry)
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Submit error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
