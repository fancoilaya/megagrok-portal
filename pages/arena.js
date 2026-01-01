import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ArenaGame from '../components/ArenaGame'
import ArenaLeaderboard from '../components/ArenaLeaderboard'
import ArenaControls from '../components/ArenaControls'

export default function Arena() {
  const [mode, setMode] = useState('idle') // idle | playing | gameover
  const [score, setScore] = useState(null)

  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  // Unified input state (PC + Mobile)
  const [input, setInput] = useState({
    dx: 0,
    dy: 0,
    attack: false
  })

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
          <p>Endless waves. Boss every 5 rounds. Survive.</p>
        </section>

        <div className="grid-two">
          {/* LEFT PANEL */}
          <div className="panel">
            {mode === 'idle' && (
              <>
                <h3>Enter the Arena</h3>
                <p>
                  🖥 PC: WASD / Arrows + Space  
                  <br />
                  📱 Mobile: Joystick + Attack button
                </p>

                <button
                  className="cta-primary"
                  onClick={() => setMode('playing')}
                >
                  ▶ START RUN
                </button>
              </>
            )}

            {mode === 'playing' && (
              <>
                <ArenaGame
                  input={input}
                  onGameOver={(finalScore) => {
                    setScore(finalScore)
                    setMode('gameover')
                  }}
                />

                {/* Mobile controls overlay */}
                <ArenaControls setInput={setInput} />
              </>
            )}

            {mode === 'gameover' && (
              <>
                <h3>Game Over</h3>
                <p>Your Score: <b>{score}</b></p>

                <input
                  placeholder="Display name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  placeholder="Wallet address"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
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
