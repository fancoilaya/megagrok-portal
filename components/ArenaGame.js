import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver, input }) {
  const canvasRef = useRef(null)

  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

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

    function spawnWave() {
      enemies.current = []
      const w = waveRef.current
      const boss = w % 5 === 0

      let count = 3 + w
      let hpBase = 30 + w * 10
      let speed = 0.8 + w * 0.05

      if (w >= 6) count += 3          // swarm jump
      if (w >= 8) hpBase += 40        // tank mobs

      if (boss) {
        enemies.current.push({
          x: 100,
          y: 250,
          hp: 300 + w * 80,
          r: 32,
          speed: 0.6,
          boss: true
        })
      } else {
        for (let i = 0; i < count; i++) {
          enemies.current.push({
            x: Math.random() * 800,
            y: Math.random() * 500,
            hp: hpBase,
            r: 16,
            speed,
            boss: false
          })
        }
      }
    }

    function closestEnemy() {
      let best = null
      let dMin = Infinity
      enemies.current.forEach(e => {
        const d = Math.hypot(e.x - player.current.x, e.y - player.current.y)
        if (d < dMin) {
          dMin = d
          best = e
        }
      })
      return best
    }

    function attack(ts) {
      if (ts - lastAttackRef.current < 350) return
      const t = closestEnemy()
      if (!t) return

      const dx = t.x - player.current.x
      const dy = t.y - player.current.y
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

      // Countdown
      if (enemies.current.length === 0) {
        countdownTimerRef.current += 0.016
        if (countdownTimerRef.current >= 1) {
          countdownRef.current -= 1
          setCountdown(countdownRef.current)
          countdownTimerRef.current = 0
        }
        if (countdownRef.current <= 0) {
          countdownRef.current = 3
          setCountdown(3)
          spawnWave()
        }
      }

      // Movement
      const speed = 4
      player.current.x += (input.dx || 0) * speed
      player.current.y += (input.dy || 0) * speed

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      // Attack
      if (input.attack) attack(ts)

      ctx.clearRect(0, 0, 800, 500)

      // Player
      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2)
      ctx.fill()

      // Bullets
      ctx.fillStyle = '#fff'
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

        if (d < e.r + 12 && ts - lastHitRef.current > 700) {
          hpRef.current -= e.boss ? 20 : 10
          setHp(hpRef.current)
          lastHitRef.current = ts
        }
      })

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

      if (hpRef.current <= 0) {
        running = false
        onGameOver(waveRef.current * 100 + kills * 10)
        return
      }

      if (enemies.current.length === 0 && countdownRef.current === 3) {
        waveRef.current++
        setWave(waveRef.current)
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
    return () => (document.body.style.overflow = '')
  }, [onGameOver, input])

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        ❤️ {hp} &nbsp; 🌊 Wave {wave} &nbsp; 💀 {kills}
        {countdown < 3 && <div>Next wave in {countdown}</div>}
      </div>
      <canvas ref={canvasRef} width={800} height={500} />
    </>
  )
}
