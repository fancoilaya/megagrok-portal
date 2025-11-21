import Header from '../components/Header'
export default function Leaderboard(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Leaderboard (Mock)</h2>
        <p>Top players for the current season (data from /api/leaderboard)</p>
        <ol>
          <li>Froggy#1 — 15,200 XP</li>
          <li>HopLord — 12,400 XP</li>
          <li>OGGrok — 11,900 XP</li>
        </ol>
      </main>
    </div>
  )
}
