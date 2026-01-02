import { useEffect, useState } from 'react'

export default function ArenaLeaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadLeaderboard() {
    try {
      setLoading(true)
      const res = await fetch('/api/arena/leaderboard')
      if (!res.ok) throw new Error('Failed to load leaderboard')
      const data = await res.json()
      setRows(data.leaderboard || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  if (loading) {
    return <p>🏆 Loading leaderboard…</p>
  }

  if (error) {
    return <p>❌ {error}</p>
  }

  if (rows.length === 0) {
    return <p>No scores yet. Be the first.</p>
  }

  return (
    <div className="panel">
      <h3>🏆 Today’s Arena Leaders</h3>

      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th align="left">#</th>
            <th align="left">Player</th>
            <th align="right">Score</th>
            <th align="right">Wave</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.rank}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td align="right">{row.score}</td>
              <td align="right">{row.wave}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="cta-secondary"
        style={{ marginTop: 12 }}
        onClick={loadLeaderboard}
      >
        Refresh
      </button>
    </div>
  )
}
