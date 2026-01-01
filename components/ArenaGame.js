import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  // Core entities
  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

  // Input
  const keys = useRef({})
  const lastTapRef = useRef(0)

  // State
  const [wave, setWave] = useState(1)
  const [hp, setHp] = useState(100)
  const [kills, setKills] = useState(0)

  const lastAttackRef = useRef(0)

  useEffect(() => {
    /* ================= RESET ================= */
    player.current = { x: 400, y: 250 }
    enemies.current = []
    bullets.current = []
    setWave(1)
    setHp(100)
    setKills(0)

    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    /* ================= SPAWN ================= */
    function spawnWave(w) {
      enemies.current = []
      const count = Math.min(3 + w, 8)

      for (let i = 0; i < count; i++) {
        enemies.current.push({
          x: Math.random() * 760 + 20,
          y: Math.random() * 460 + 20,
          hp: 20 + w * 6,
          speed: 0.5 + w * 0.05,
          r: 14
        })
      }
    }

    spawnWave(1)

    /* ================= ATTACK ================= */
    function attack(ts) {
      if (ts - lastAttackRef.current < 350) return
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

      lastAttackRef.current = ts
    }

    /* ================= LOOP ================= */
    function loop(ts) {
      if (!running) return

      // Movement (PC)
      const speed = 3
      if (keys.current['w'] || keys.current['ArrowUp']) player.current.y -= speed
      if (keys.current['s'] || keys.current['ArrowDown']) player.current.y += speed
      if (keys.current['a'] || keys.current['ArrowLeft']) player.current.x -= speed
      if (keys.current['d'] || keys.current['ArrowRight']) player.current.x += speed

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      ctx.clearRect(0, 0, 800, 500)

      // Player
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2)
      ctx.fill()

      // Bullets
      ctx.fillStyle = '#ffffff'
      bullets.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        ctx.beginPath()
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Enemies
      enemies.current.forEach(e => {
        const dx = player.current.x - e.x
        const dy = player.current.y - e.y
        const d = Math.hypot(dx, dy)

        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        ctx.fillStyle = '#ff4444'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()

        if (d < e.r + 12) {
          setHp(h => Math.max(0, h - 0.15))
        }
      })

      // Hits
      bullets.current.forEach(b => {
        enemies.current.forEach(e => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.r) {
            e.hp -= 10
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

      // Next wave
      if (enemies.current.length === 0) {
        setWave(w => {
          const next = w + 1
          spawnWave(next)
          return next
        })
      }

      // Death
      if (hp <= 0) {
        running = false
        onGameOver(wave * 100 + kills * 10)
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    /* ================= INPUT ================= */
    window.addEventListener('keydown', e => {
      keys.current[e.key] = true
      if (e.code === 'Space') attack(performance.now())
    })

    window.addEventListener('keyup', e => {
      keys.current[e.key] = false
    })

    // Mobile: tap to move, double-tap to attack
    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      const t = e.touches[0]
      const rect = canvas.getBoundingClientRect()

      const x = ((t.clientX - rect.left) / rect.width) * 800
      const y = ((t.clientY - rect.top) / rect.height) * 500

      player.current.x = x
      player.current.y = y

      const now = Date.now()
      if (now - lastTapRef.current < 300) {
        attack(performance.now())
      }
      lastTapRef.current = now
    })

    return () => {
      running = false
      document.body.style.overflow = ''
    }
  }, [onGameOver, hp, wave, kills])

  return (
    <>
      <div style={{ marginBottom: 6 }}>
        ❤️ {Math.floor(hp)} &nbsp; 🌊 Wave {wave} &nbsp; 💀 {kills}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          width: '100%',
          maxWidth: 800,
          display: 'block',
          touchAction: 'none',
          userSelect: 'none'
        }}
      />
    </>
  )
}
