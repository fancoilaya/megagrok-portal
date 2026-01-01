import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ArenaGame from '../components/ArenaGame'
import ArenaLeaderboard from '../components/ArenaLeaderboard'

export default function Arena() {
  const [mode, setMode] = useState('idle') // idle | playing | gameover
  const [score, setScore] = useState(null)
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  async function submitScore() {
    if (!name || !wallet || score === null) return

    await fetch('/api/arena/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, wallet, score })
    })

    setName('')
    setWallet('')
    setScore(null)
    setMode('idle')
  }

  return (
    <>
      <Header />

      <main className="container">
        {/* HERO */}
        <section className="hero">
          <h1>MEGAGROK ARENA</h1>
          <p>Endless survival. One Grok. Pure skill.</p>
        </section>

        <div className="grid-two">
          {/* LEFT PANEL */}
          <div className="panel">
            {mode === 'idle' && (
              <>
                <h3>Ready to enter?</h3>
                <p>
                  You start with full HP.  
                  Enemies grow stronger the longer you survive.
                </p>

                <button
                  className="cta-primary"
                  onClick={() => setMode('playing')}
                >
                  ▶ START ARENA
                </button>
              </>
            )}

            {mode === 'playing' && (
              <ArenaGame
                onGameOver={(finalScore) => {
                  setScore(finalScore)
                  setMode('gameover')
                }}
              />
            )}

            {mode === 'gameover' && (
              <>
                <h3>Game Over</h3>
                <p>Your Score: <b>{score}</b></p>

                <input
                  placeholder="Display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  placeholder="Wallet address"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                />

                <button
                  className="cta-primary"
                  onClick={submitScore}
                >
                  Submit Score
                </button>

                <button
                  className="cta-secondary"
                  onClick={() => {
                    setScore(null)
                    setMode('idle')
                  }}
                >
                  Play Again
                </button>
              </>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="panel">
            <ArenaLeaderboard />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
