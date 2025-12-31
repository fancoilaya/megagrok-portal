import { sql } from '@vercel/postgres'
import { checkDailyReset } from '../../../lib/arenaDb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, wallet, score } = req.body
  if (!name || !wallet || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  await checkDailyReset()

  await sql`
    INSERT INTO arena_scores (display_name, wallet, score)
    VALUES (${name}, ${wallet}, ${score})
  `

  res.json({ ok: true })
}
