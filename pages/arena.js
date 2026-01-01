import Header from '../components/Header'
import Footer from '../components/Footer'
import ArenaGame from '../components/ArenaGame'
import ArenaLeaderboard from '../components/ArenaLeaderboard'
import { useState } from 'react'

export default function Arena() {
  const [score, setScore] = useState(null)
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  async function submitScore() {
    await fetch('/api/arena/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, wallet, score })
    })
    location.reload()
  }

  return (
    <>
      <Header />
      <main className="container">
        <section className="hero">
          <h1>MEGAGROK ARENA</h1>
          <p>Endless survival. One Grok. Pure skill.</p>
        </section>

        <div className="grid-two">
          <div className="panel">
            {score === null ? (
              <ArenaGame onGameOver={setScore} />
            ) : (
              <>
                <h3>Game Over</h3>
                <p>Your Score: <b>{score}</b></p>
                <input placeholder="Display name" onChange={e => setName(e.target.value)} />
                <input placeholder="Wallet address" onChange={e => setWallet(e.target.value)} />
                <button className="cta-primary" onClick={submitScore}>
                  Submit Score
                </button>
              </>
            )}
          </div>

          <div className="panel">
            <ArenaLeaderboard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
