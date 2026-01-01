import { useEffect, useState } from 'react'

export default function ArenaLeaderboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/arena/leaderboard')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return <p>Loading leaderboard…</p>

  return (
    <>
      <h3>Today</h3>
      <ol>
        {data.today.map((e, i) => (
          <li key={i}>{e.display_name} — {e.score}</li>
        ))}
      </ol>

      <h3>Recent Winners</h3>
      <ol>
        {data.history.map((e, i) => (
          <li key={i}>
            {e.date} · #{e.rank} · {e.display_name} — {e.score}
          </li>
        ))}
      </ol>
    </>
  )
}
