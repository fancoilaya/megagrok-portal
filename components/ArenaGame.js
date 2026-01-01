import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)
  const enemiesRef = useRef([])
  const playerRef = useRef({ x: 400, y: 250 })

  const [hp, setHp] = useState(100)
  const [time, setTime] = useState(0)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let running = true
    enemiesRef.current = []
    playerRef.current = { x: 400, y: 250 }

    function spawnEnemy() {
      enemiesRef.current.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        r: 10,
        speed: 0.6 + time * 0.01
      })
    }

    function loop() {
      if (!running) return

      setTime(t => t + 0.016)

      if (Math.random() < 0.03) spawnEnemy()

      ctx.clearRect(0, 0, 800, 500)

      // Player
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(playerRef.current.x, playerRef.current.y, 10, 0, Math.PI * 2)
      ctx.fill()

      // Enemies
      ctx.fillStyle = '#ff4d4d'
      enemiesRef.current.forEach(e => {
        const dx = playerRef.current.x - e.x
        const dy = playerRef.current.y - e.y
        const d = Math.hypot(dx, dy)

        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()

        if (d < 18) {
          setHp(h => h - 1)
          e.dead = true
        }
      })

      enemiesRef.current = enemiesRef.current.filter(e => {
        if (e.dead) {
          setKills(k => k + 1)
          return false
        }
        return true
      })

      if (hp <= 0) {
        running = false
        onGameOver(Math.floor(time * 5 + kills))
        return
      }

      requestAnimationFrame(loop)
    }

    loop()

    function handleKey(e) {
      if (e.key === 'ArrowUp') playerRef.current.y -= 10
      if (e.key === 'ArrowDown') playerRef.current.y += 10
      if (e.key === 'ArrowLeft') playerRef.current.x -= 10
      if (e.key === 'ArrowRight') playerRef.current.x += 10
    }

    window.addEventListener('keydown', handleKey)

    return () => {
      running = false
      window.removeEventListener('keydown', handleKey)
    }
  }, [hp, time, kills, onGameOver])

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        ❤️ {hp} &nbsp; ⏱ {time.toFixed(1)} &nbsp; 💀 {kills}
      </div>
      <canvas ref={canvasRef} width={800} height={500} />
    </>
  )
}
