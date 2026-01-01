import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver, input }) {
  const canvasRef = useRef(null)

  // Core entities
  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

  // Input
  const keys = useRef({})

  // Timers / refs
  const hpRef = useRef(100)
  const lastHitRef = useRef(0)
  const lastAttackRef = useRef(0)

  const waveRef = useRef(1)
  const waveActiveRef = useRef(false)

  const countdownRef = useRef(3)
  const countdownTimerRef = useRef(0)

  // UI state
  const [hp, setHp] = useState(100)
  const [wave, setWave] = useState(1)
  const [countdown, setCountdown] = useState(3)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    /* ---------------- HARD RESET ON START ---------------- */
    player.current = { x: 400, y: 250 }
    enemies.current = []
    bullets.current = []

    hpRef.current = 100
    lastHitRef.current = 0
    lastAttackRef.current = 0

    waveRef.current = 1
    waveActiveRef.current = false
    countdownRef.current = 3
    countdownTimerRef.current = 0

    setHp(100)
    setWave(1)
    setCountdown(3)
    setKills(0)

    // Lock browser behavior
    document.body.style.overflow = 'hidden'
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.webkitTouchCallout = 'none'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    /* ---------------- WAVE SPAWN ---------------- */
    function spawnWave() {
      enemies.current = []
      waveActiveRef.current = true

      const w = waveRef.current
      const isBoss = w % 5 === 0

      const count = isBoss ? 1 : Math.min(4 + w, 10)
      const hpBase = isBoss ? 300 + w * 60 : 40 + w * 12
      const speed = isBoss ? 0.45 : Math.min(0.6 + w * 0.05, 1.2)

      for (let i = 0; i < count; i++) {
        enemies.current.push({
          x: Math.random() * 760 + 20,
          y: Math.random() * 460 + 20,
          hp: hpBase,
          r: isBoss ? 28 : 16,
          speed,
          boss: isBoss
        })
      }
    }

    /* ---------------- HELPERS ---------------- */
    function closestEnemy() {
      let best = null
      let bestD = Infinity
      enemies.current.forEach(e => {
        const d = Math.hypot(e.x - player.current.x, e.y - player.current.y)
        if (d < bestD) {
          bestD = d
          best = e
        }
      })
      return best
    }

    function attack(ts) {
      if (ts - lastAttackRef.current < 300) return
      const target = closestEnemy()
      if (!target) return

      const dx = target.x - player.current.x
      const dy = target.y - player.current.y
      const d = Math.hypot(dx, dy)

      bullets.current.push({
        x: player.current.x,
        y: player.current.y,
        vx: (dx / d) * 7,
        vy: (dy / d) * 7,
        dmg: 12
      })

      lastAttackRef.current = ts
    }

    /* ---------------- GAME LOOP ---------------- */
    function loop(ts) {
      if (!running) return

      // Countdown between waves
      if (!waveActiveRef.current) {
        countdownTimerRef.current += 0.016
        if (countdownTimerRef.current >= 1) {
          countdownRef.current--
          setCountdown(countdownRef.current)
          countdownTimerRef.current = 0
        }

        if (countdownRef.current <= 0) {
          countdownRef.current = 3
          setCountdown(3)
          spawnWave()
        }
      }

      /* -------- PLAYER MOVEMENT -------- */
      const speed = 3.2

      // PC keyboard
      if (keys.current['w'] || keys.current['ArrowUp']) player.current.y -= speed
      if (keys.current['s'] || keys.current['ArrowDown']) player.current.y += speed
      if (keys.current['a'] || keys.current['ArrowLeft']) player.current.x -= speed
      if (keys.current['d'] || keys.current['ArrowRight']) player.current.x += speed

      // Mobile joystick (velocity only)
      const jx = Math.max(-1, Math.min(1, input.dx || 0))
      const jy = Math.max(-1, Math.min(1, input.dy || 0))

      if (Math.abs(jx) > 0.15 || Math.abs(jy) > 0.15) {
        player.current.x += jx * speed * 2
        player.current.y += jy * speed * 2
      }

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      if (input.attack) attack(ts)

      /* -------- RENDER -------- */
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

        ctx.fillStyle = e.boss ? '#ff0000' : '#ff4444'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()

        if (d < e.r + 12 && ts - lastHitRef.current > 800) {
          hpRef.current -= e.boss ? 20 : 8
          setHp(hpRef.current)
          lastHitRef.current = ts
        }
      })

      // Bullet hits
      bullets.current.forEach(b => {
        enemies.current.forEach(e => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.r) {
            e.hp -= b.dmg
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

      // Wave cleared → increment ONCE
      if (waveActiveRef.current && enemies.current.length === 0) {
        waveActiveRef.current = false
        waveRef.current += 1
        setWave(waveRef.current)
      }

      // Death
      if (hpRef.current <= 0) {
        running = false
        onGameOver(waveRef.current * 100 + kills * 10)
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    /* ---------------- INPUT LISTENERS ---------------- */
    window.addEventListener('keydown', e => {
      keys.current[e.key] = true
      if (e.code === 'Space') input.attack = true
    })

    window.addEventListener('keyup', e => {
      keys.current[e.key] = false
      if (e.code === 'Space') input.attack = false
    })

    window.addEventListener('mousedown', () => attack(performance.now()))

    return () => {
      running = false
      document.body.style.overflow = ''
    }
  }, [onGameOver, input])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 6 }}>
        ❤️ {hp} &nbsp; 🌊 Wave {wave} &nbsp; 💀 {kills}
        {!waveActiveRef.current && <div>Next wave in {countdown}</div>}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          touchAction: 'none',
          userSelect: 'none'
        }}
      />
    </div>
  )
}
