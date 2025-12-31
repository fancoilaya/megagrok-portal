import { sql } from '@vercel/postgres'

export async function initArenaDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS arena_scores (
      id SERIAL PRIMARY KEY,
      display_name TEXT NOT NULL,
      wallet TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS arena_daily_winners (
      date TEXT,
      rank INTEGER,
      display_name TEXT,
      wallet TEXT,
      score INTEGER
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS arena_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `
}

export async function checkDailyReset() {
  await initArenaDb()

  const today = new Date().toISOString().slice(0, 10)
  const meta = await sql`SELECT value FROM arena_meta WHERE key='last_reset'`

  if (meta.rowCount === 0 || meta.rows[0].value !== today) {
    const winners = await sql`
      SELECT display_name, wallet, score
      FROM arena_scores
      ORDER BY score DESC
      LIMIT 10
    `

    let rank = 1
    for (const w of winners.rows) {
      await sql`
        INSERT INTO arena_daily_winners (date, rank, display_name, wallet, score)
        VALUES (${today}, ${rank++}, ${w.display_name}, ${w.wallet}, ${w.score})
      `
    }

    await sql`DELETE FROM arena_scores`

    await sql`
      INSERT INTO arena_meta (key, value)
      VALUES ('last_reset', ${today})
      ON CONFLICT (key) DO UPDATE SET value=${today}
    `
  }
}
