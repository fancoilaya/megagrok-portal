import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ArenaLeaderboard from '../components/ArenaLeaderboard'

export default function ArenaPage() {
  const gameRef = useRef(null)

  const [mode, setMode] = useState('idle') // idle | playing | gameover
  const [score, setScore] = useState(0)
  const [finalWave, setFinalWave] = useState(0)
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  // -----------------------------
  // START / STOP PHASER GAME
  // -----------------------------
  useEffect(() => {
    if (mode !== 'playing') return

    let destroyed = false

    import('../game/index').then(({ startArenaGame }) => {
      if (destroyed) return

      gameRef.current = startArenaGame(
        'arena-container',
        ({ score, wave }) => {
          setScore(score)
          setFinalWave(wave)
          setMode('gameover')
        }
      )
    })

    return () => {
      destroyed = true
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [mode])

  // -----------------------------
  // SUBMIT SCORE
  // -----------------------------
  async function submitScore() {
    if (!wallet) return

    await fetch('/api/arena/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet,
        name,
        score,
        wave: finalWave
      })
    })

    setMode('idle')
    setScore(0)
    setFinalWave(0)
    setName('')
    setWallet('')
  }

  return (
    <>
      <Header />

      <main className="container">
        <section className="hero">
          <h1>MEGAGROK ARENA</h1>
          <p>Survive endless waves. Mobile & PC.</p>
        </section>

        {/* ---------------- IDLE ---------------- */}
        {mode === 'idle' && (
          <div className="panel">
            <p>
              🖥 WASD / Arrows + Space<br />
              📱 Virtual joystick + attack button
            </p>

            <button
              className="cta-primary"
              onClick={() => setMode('playing')}
            >
              ▶ START ARENA
            </button>
          </div>
        )}

        {/* ---------------- PLAYING ---------------- */}
        {mode === 'playing' && (
          <div
            id="arena-container"
            style={{
              width: '100%',
              maxWidth: 900,
              height: 500,           // 🔥 CRITICAL — NEVER REMOVE
              margin: '0 auto',
              background: '#000',
              position: 'relative',
              overflow: 'hidden'
            }}
          />
        )}

        {/* ---------------- GAME OVER ---------------- */}
        {mode === 'gameover' && (
          <div className="panel">
            <h3>Game Over</h3>

            <p>
              🏆 Score: <b>{score}</b><br />
              🌊 Wave reached: <b>{finalWave}</b>
            </p>

            <input
              placeholder="Name (optional)"
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
              onClick={() => setMode('idle')}
            >
              Play Again
            </button>
          </div>
        )}

        {/* ---------------- LEADERBOARD ---------------- */}
        {mode !== 'playing' && <ArenaLeaderboard />}
      </main>

      <Footer />
    </>
  )
}
