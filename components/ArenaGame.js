import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

  const keys = useRef({})
  const joystick = useRef({ active: false, dx: 0, dy: 0 })

  const hpRef = useRef(100)
  const lastHitRef = useRef(0)
  const lastAttackRef = useRef(0)

  const waveRef = useRef(1)
  const countdownRef = useRef(3)
  const countdownTimerRef = useRef(0)

  const [hp, setHp] = useState(100)
  const [wave, setWave] = useState(1)
  const [countdown, setCountdown] = useState(3)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    enemies.current = []
    bullets.current = []
    hpRef.current = 100
    waveRef.current = 1
    countdownRef.current = 3
    setWave(1)
    setCountdown(3)

    /* ------------------ GAME LOGIC ------------------ */

    function startWave() {
      enemies.current = []

      const isBoss = waveRef.current % 5 === 0
      const enemyCount = isBoss ? 1 : 3 + waveRef.current
      const hpBase = isBoss ? 300 + waveRef.current * 50 : 40 + waveRef.current * 15

      for (let i = 0; i < enemyCount; i++) {
        enemies.current.push({
          x: Math.random() * 800,
          y: Math.random() * 500,
          hp: hpBase,
          r: isBoss ? 30 : 16,
          speed: isBoss ? 0.6 : 1.0 + waveRef.current * 0.05,
          boss: isBoss
        })
      }
    }

    function closestEnemy() {
      let best = null
      let bestD = Infinity
      enemies.current.forEach(e => {
        const d = Math.hypot(e.x - player.current.x, e.y - player.current.y)
        if (d < bestD) {
          best = e
          bestD = d
        }
      })
      return best
    }

    function attack(ts) {
      if (ts - lastAttackRef.current < 350) return
      const target = closestEnemy()
      if (!target) return

      const dx = target.x - player.current.x
      const dy = target.y - player.current.y
      const d = Math.hypot(dx, dy)

      bullets.current.push({
        x: player.current.x,
        y: player.current.y,
        vx: (dx / d) * 8,
        vy: (dy / d) * 8,
        dmg: 12
      })

      lastAttackRef.current = ts
    }

    function loop(ts) {
      if (!running) return

      /* ---- COUNTDOWN ---- */
      if (enemies.current.length === 0) {
        countdownTimerRef.current += 0.016
        if (countdownTimerRef.current >= 1) {
          countdownRef.current -= 1
          setCountdown(countdownRef.current)
          countdownTimerRef.current = 0
        }
        if (countdownRef.current <= 0) {
          countdownRef.current = 0
          setCountdown(0)
          startWave()
        }
      }

      /* ---- MOVEMENT ---- */
      const speed = 4

      // PC keyboard
      if (keys.current['w'] || keys.current['ArrowUp']) player.current.y -= speed
      if (keys.current['s'] || keys.current['ArrowDown']) player.current.y += speed
      if (keys.current['a'] || keys.current['ArrowLeft']) player.current.x -= speed
      if (keys.current['d'] || keys.current['ArrowRight']) player.current.x += speed

      // Mobile joystick
      if (joystick.current.active) {
        player.current.x += joystick.current.dx * speed
        player.current.y += joystick.current.dy * speed
      }

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      ctx.clearRect(0, 0, 800, 500)

      /* ---- PLAYER ---- */
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2)
      ctx.fill()

      /* ---- BULLETS ---- */
      ctx.fillStyle = '#ffffff'
      bullets.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        ctx.beginPath()
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      /* ---- ENEMIES ---- */
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

        if (d < e.r + 12 && ts - lastHitRef.current > 700) {
          hpRef.current -= e.boss ? 20 : 10
          setHp(hpRef.current)
          lastHitRef.current = ts
        }
      })

      /* ---- COLLISIONS ---- */
      bullets.current.forEach(b => {
        enemies.current.forEach(e => {
          const d = Math.hypot(b.x - e.x, b.y - e.y)
          if (d < e.r) {
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

      if (enemies.current.length === 0 && countdownRef.current === 0) {
        waveRef.current += 1
        setWave(waveRef.current)
        countdownRef.current = 3
        setCountdown(3)
      }

      if (hpRef.current <= 0) {
        running = false
        onGameOver(waveRef.current * 100 + kills * 10)
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    /* ------------------ CONTROLS ------------------ */

    // Keyboard
    window.addEventListener('keydown', e => {
      keys.current[e.key] = true
      if (e.code === 'Space') attack(performance.now())
    })
    window.addEventListener('keyup', e => {
      keys.current[e.key] = false
    })

    // Mouse
    window.addEventListener('mousedown', () => attack(performance.now()))

    // Mobile joystick (bottom-left)
    const joyBase = { x: 80, y: window.innerHeight - 80 }

    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0]
      if (t.clientX < window.innerWidth / 2) {
        joystick.current.active = true
      } else {
        attack(performance.now())
      }
    })

    canvas.addEventListener('touchmove', e => {
      if (!joystick.current.active) return
      const t = e.touches[0]
      const dx = (t.clientX - joyBase.x) / 40
      const dy = (t.clientY - joyBase.y) / 40
      joystick.current.dx = Math.max(-1, Math.min(1, dx))
      joystick.current.dy = Math.max(-1, Math.min(1, dy))
    })

    canvas.addEventListener('touchend', () => {
      joystick.current.active = false
      joystick.current.dx = 0
      joystick.current.dy = 0
    })

    return () => {
      running = false
      document.body.style.overflow = ''
    }
  }, [onGameOver])

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        ❤️ {hp} &nbsp; 🌊 Wave {wave} &nbsp; 💀 {kills}
        {countdown > 0 && <div>Next wave in {countdown}</div>}
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
    </>
  )
}
