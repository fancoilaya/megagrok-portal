import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

  const hpRef = useRef(100)
  const lastHitRef = useRef(0)
  const lastAttackRef = useRef(0)

  const waveRef = useRef(1)
  const waveTimerRef = useRef(0)
  const spawningRef = useRef(false)

  const moveVec = useRef({ x: 0, y: 0 })

  const [hp, setHp] = useState(100)
  const [wave, setWave] = useState(1)
  const [countdown, setCountdown] = useState(3)
  const [kills, setKills] = useState(0)

  useEffect(() => {
    // Lock scrolling on mobile while playing
    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    enemies.current = []
    bullets.current = []
    hpRef.current = 100
    waveRef.current = 1
    setWave(1)
    setCountdown(3)

    function startWave() {
      enemies.current = []
      bullets.current = []
      spawningRef.current = true

      const isBoss = waveRef.current % 5 === 0
      const enemyCount = isBoss ? 1 : 3 + waveRef.current
      const hpBase = isBoss ? 200 + waveRef.current * 40 : 25 + waveRef.current * 10

      for (let i = 0; i < enemyCount; i++) {
        enemies.current.push({
          x: Math.random() * 800,
          y: Math.random() * 500,
          hp: hpBase,
          r: isBoss ? 28 : 16,
          speed: isBoss ? 0.6 : 0.9 + waveRef.current * 0.05,
          boss: isBoss
        })
      }

      spawningRef.current = false
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
        dmg: 10
      })

      lastAttackRef.current = ts
    }

    function loop(ts) {
      if (!running) return

      // Countdown between waves
      if (countdown > 0 && enemies.current.length === 0) {
        waveTimerRef.current += 0.016
        if (waveTimerRef.current >= 1) {
          setCountdown(c => c - 1)
          waveTimerRef.current = 0
        }
        requestAnimationFrame(loop)
        return
      }

      if (countdown === 0 && enemies.current.length === 0) {
        startWave()
      }

      // Movement (mobile joystick)
      player.current.x += moveVec.current.x * 4
      player.current.y += moveVec.current.y * 4

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

        ctx.fillStyle = e.boss ? '#ff0000' : '#ff4444'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()

        // Player hit (i-frames)
        if (d < e.r + 12 && ts - lastHitRef.current > 700) {
          hpRef.current -= e.boss ? 20 : 10
          setHp(hpRef.current)
          lastHitRef.current = ts
        }
      })

      // Bullet hits
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

      // Wave cleared
      if (!spawningRef.current && enemies.current.length === 0 && countdown === 0) {
        waveRef.current += 1
        setWave(waveRef.current)
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

    // Mobile joystick (left side)
    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0]
      if (t.clientX < window.innerWidth / 2) {
        moveVec.current = { x: 0, y: 0 }
      } else {
        attack(performance.now())
      }
    })

    canvas.addEventListener('touchmove', e => {
      const t = e.touches[0]
      if (t.clientX < window.innerWidth / 2) {
        moveVec.current = {
          x: (t.clientX - window.innerWidth * 0.25) / 80,
          y: (t.clientY - window.innerHeight * 0.5) / 80
        }
      }
    })

    canvas.addEventListener('touchend', () => {
      moveVec.current = { x: 0, y: 0 }
    })

    // Desktop attack
    window.addEventListener('mousedown', () => attack(performance.now()))
    window.addEventListener('keydown', e => {
      if (e.code === 'Space') attack(performance.now())
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
        {countdown > 0 && (
          <div style={{ fontSize: 20, marginTop: 6 }}>
            Next wave in {countdown}
          </div>
        )}
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
