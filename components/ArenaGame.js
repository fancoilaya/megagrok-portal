import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])
  const keys = useRef({})

  const hpRef = useRef(100)
  const lastHitRef = useRef(0)

  const [hp, setHp] = useState(100)
  const [time, setTime] = useState(0)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    enemies.current = []
    bullets.current = []
    hpRef.current = 100
    lastHitRef.current = 0

    function spawnEnemy() {
      enemies.current.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        hp: 3,
        speed: 0.6 + time * 0.01
      })
    }

    function shoot() {
      if (enemies.current.length === 0) return

      const target = enemies.current[0]
      const dx = target.x - player.current.x
      const dy = target.y - player.current.y
      const d = Math.hypot(dx, dy)

      bullets.current.push({
        x: player.current.x,
        y: player.current.y,
        vx: (dx / d) * 6,
        vy: (dy / d) * 6
      })
    }

    const shootInterval = setInterval(shoot, 400)

    function loop(ts) {
      if (!running) return

      setTime(t => t + 0.016)
      if (Math.random() < 0.03) spawnEnemy()

      // Movement
      const speed = 4
      if (keys.current['w'] || keys.current['ArrowUp']) player.current.y -= speed
      if (keys.current['s'] || keys.current['ArrowDown']) player.current.y += speed
      if (keys.current['a'] || keys.current['ArrowLeft']) player.current.x -= speed
      if (keys.current['d'] || keys.current['ArrowRight']) player.current.x += speed

      player.current.x = Math.max(10, Math.min(790, player.current.x))
      player.current.y = Math.max(10, Math.min(490, player.current.y))

      ctx.clearRect(0, 0, 800, 500)

      // Player
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 10, 0, Math.PI * 2)
      ctx.fill()

      // Bullets
      ctx.fillStyle = '#ffffff'
      bullets.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Enemies
      ctx.fillStyle = '#ff4444'
      enemies.current.forEach(e => {
        const dx = player.current.x - e.x
        const dy = player.current.y - e.y
        const d = Math.hypot(dx, dy)

        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        ctx.beginPath()
        ctx.arc(e.x, e.y, 10, 0, Math.PI * 2)
        ctx.fill()

        // Damage with i-frames (500ms)
        if (d < 18 && ts - lastHitRef.current > 500) {
          hpRef.current -= 10
          setHp(hpRef.current)
          lastHitRef.current = ts
        }
      })

      // Bullet hits
      bullets.current.forEach(b => {
        enemies.current.forEach(e => {
          const d = Math.hypot(b.x - e.x, b.y - e.y)
          if (d < 12) {
            e.hp -= 1
            b.dead = true
          }
        })
      })

      bullets.current = bullets.current.filter(b => !b.dead)

      enemies.current = enemies.current.filter(e => {
        if (e.hp <= 0) {
          setKills(k => k + 1)
          return false
        }
        return true
      })

      if (hpRef.current <= 0) {
        running = false
        clearInterval(shootInterval)
        onGameOver(Math.floor(time * 5 + kills))
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    function keyDown(e) {
      keys.current[e.key] = true
    }

    function keyUp(e) {
      keys.current[e.key] = false
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    return () => {
      running = false
      clearInterval(shootInterval)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [onGameOver])

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        ❤️ {hp} &nbsp; ⏱ {time.toFixed(1)} &nbsp; 💀 {kills}
      </div>
      <canvas ref={canvasRef} width={800} height={500} />
    </>
  )
}
