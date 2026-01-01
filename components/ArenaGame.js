import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  // GAME STATE (REFS ONLY)
  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])
  const waveRef = useRef(1)
  const hpRef = useRef(100)

  const keys = useRef({})
  const lastAttackRef = useRef(0)

  // UI STATE (DISPLAY ONLY)
  const [waveUI, setWaveUI] = useState(1)
  const [hpUI, setHpUI] = useState(100)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    // HARD INIT (RUNS ONCE)
    player.current = { x: 400, y: 250 }
    enemies.current = []
    bullets.current = []
    waveRef.current = 1
    hpRef.current = 100
    setWaveUI(1)
    setHpUI(100)
    setKills(0)

    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    function spawnWave() {
      enemies.current = []
      const w = waveRef.current
      const count = Math.min(3 + w, 8)

      for (let i = 0; i < count; i++) {
        enemies.current.push({
          x: Math.random() * 760 + 20,
          y: Math.random() * 460 + 20,
          hp: 20 + w * 6,
          speed: 0.6 + w * 0.04,
          r: 14
        })
      }
    }

    spawnWave()

    function attack(ts) {
      if (ts - lastAttackRef.current < 350) return
      if (enemies.current.length === 0) return

      const e = enemies.current[0]
      const dx = e.x - player.current.x
      const dy = e.y - player.current.y
      const d = Math.hypot(dx, dy)

      bullets.current.push({
        x: player.current.x,
        y: player.current.y,
        vx: (dx / d) * 6,
        vy: (dy / d) * 6
      })

      lastAttackRef.current = ts
    }

    function loop(ts) {
      if (!running) return

      // MOVEMENT (PC)
      const speed = 3
      if (keys.current['w'] || keys.current['ArrowUp']) player.current.y -= speed
      if (keys.current['s'] || keys.current['ArrowDown']) player.current.y += speed
      if (keys.current['a'] || keys.current['ArrowLeft']) player.current.x -= speed
      if (keys.current['d'] || keys.current['ArrowRight']) player.current.x += speed

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      ctx.clearRect(0, 0, 800, 500)

      // PLAYER
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2)
      ctx.fill()

      // BULLETS
      ctx.fillStyle = '#fff'
      bullets.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        ctx.beginPath()
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // ENEMIES
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
          hpRef.current -= 0.15
        }
      })

      // COLLISIONS
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

      // WAVE COMPLETE (ONCE)
      if (enemies.current.length === 0) {
        waveRef.current += 1
        setWaveUI(waveRef.current)
        spawnWave()
      }

      // SYNC UI
      setHpUI(Math.max(0, Math.floor(hpRef.current)))

      // GAME OVER
      if (hpRef.current <= 0) {
        running = false
        onGameOver(waveRef.current * 100 + kills * 10)
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    // INPUT
    window.addEventListener('keydown', e => {
      keys.current[e.key] = true
      if (e.code === 'Space') attack(performance.now())
    })
    window.addEventListener('keyup', e => {
      keys.current[e.key] = false
    })

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      const t = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      player.current.x = ((t.clientX - rect.left) / rect.width) * 800
      player.current.y = ((t.clientY - rect.top) / rect.height) * 500
      attack(performance.now())
    })

    return () => {
      running = false
      document.body.style.overflow = ''
    }
  }, [onGameOver])

  return (
    <>
      <div style={{ marginBottom: 6 }}>
        ❤️ {hpUI} &nbsp; 🌊 Wave {waveUI} &nbsp; 💀 {kills}
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
