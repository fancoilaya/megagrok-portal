import { sql } from '@vercel/postgres'
import { checkDailyReset } from '../../../lib/arenaDb'

export default async function handler(req, res) {
  await checkDailyReset()

  const today = await sql`
    SELECT display_name, score
    FROM arena_scores
    ORDER BY score DESC
    LIMIT 10
  `

  const history = await sql`
    SELECT date, rank, display_name, score
    FROM arena_daily_winners
    ORDER BY date DESC, rank ASC
    LIMIT 10
  `

  res.json({
    today: today.rows,
    history: history.rows
  })
}

