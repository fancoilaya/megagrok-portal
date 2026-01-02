import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ArenaLeaderboard from '../components/ArenaLeaderboard'

export default function ArenaPage() {
  const gameRef = useRef(null)
  const containerRef = useRef(null)

  const [mode, setMode] = useState('idle')
  const [score, setScore] = useState(null)
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  useEffect(() => {
    if (mode !== 'playing') return

    let gameInstance

    import('../game/index').then(({ startArenaGame }) => {
      gameInstance = startArenaGame('arena-container', (finalScore) => {
        setScore(finalScore)
        setMode('gameover')
      })
      gameRef.current = gameInstance
    })

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [mode])

  async function submitScore() {
    if (!wallet || score === null) return

    await fetch('/api/arena/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet,
        name,
        score
      })
    })

    setMode('idle')
    setScore(null)
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

        {mode === 'idle' && (
          <div className="panel">
            <p>
              🖥 WASD / Arrows + Space<br />
              📱 Touch = attack (joystick coming next)
            </p>

            <button
              className="cta-primary"
              onClick={() => setMode('playing')}
            >
              ▶ START ARENA
            </button>
          </div>
        )}

        {mode === 'playing' && (
          <div
            id="arena-container"
            ref={containerRef}
            style={{
              width: '100%',
              maxWidth: 900,
              margin: '0 auto'
            }}
          />
        )}

        {mode !== 'playing' && <ArenaLeaderboard />}
        {mode === 'gameover' && (
          <div className="panel">
            <h3>Game Over</h3>
            <p>Your Score: <b>{score}</b></p>

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
      </main>

      <Footer />
    </>
  )
}
