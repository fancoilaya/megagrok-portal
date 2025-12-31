import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)
  const [hp, setHp] = useState(100)
  const [time, setTime] = useState(0)
  const [kills, setKills] = useState(0)
  const enemies = useRef([])
  const player = useRef({ x: 400, y: 250 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    const loop = () => {
      if (!running) return

      setTime(t => t + 0.016)

      if (Math.random() < 0.03) {
        enemies.current.push({
          x: Math.random() * 800,
          y: Math.random() * 500,
          r: 10,
          speed: 0.6 + time * 0.01
        })
      }

      enemies.current.forEach(e => {
        const dx = player.current.x - e.x
        const dy = player.current.y - e.y
        const d = Math.hypot(dx, dy)
        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        if (d < 18) {
          setHp(h => h - 1)
          e.dead = true
        }
      })

      enemies.current = enemies.current.filter(e => {
        if (e.dead) {
          setKills(k => k + 1)
          return false
        }
        return true
      })

      ctx.clearRect(0, 0, 800, 500)

      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#ff4d4d'
      enemies.current.forEach(e => {
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (hp <= 0) {
        running = false
        onGameOver(Math.floor(time * 5 + kills))
      } else {
        requestAnimationFrame(loop)
      }
    }

    loop()

    window.onkeydown = e => {
      if (e.key === 'ArrowUp') player.current.y -= 10
      if (e.key === 'ArrowDown') player.current.y += 10
      if (e.key === 'ArrowLeft') player.current.x -= 10
      if (e.key === 'ArrowRight') player.current.x += 10
    }
  }, [hp, time, kills, onGameOver])

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        ❤️ {hp} | ⏱ {time.toFixed(1)} | 💀 {kills}
      </div>
      <canvas ref={canvasRef} width={800} height={500} />
    </>
  )
}
