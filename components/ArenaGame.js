import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  // -------- GAME STATE (REFS) --------
  const player = useRef({ x: 400, y: 250 })
  const enemies = useRef([])
  const bullets = useRef([])

  const waveRef = useRef(1)
  const hpRef = useRef(100)
  const killsRef = useRef(0)

  const lastAttackRef = useRef(0)
  const waveClearedRef = useRef(false)
  const countdownRef = useRef(3)
  const countdownTimerRef = useRef(0)

  const movingRef = useRef(false)
  const moveVecRef = useRef({ x: 0, y: 0 })

  // Mobile touch anchor
  const touchAnchorRef = useRef(null)
  const touchStartTimeRef = useRef(0)

  // -------- UI STATE --------
  const [uiWave, setUiWave] = useState(1)
  const [uiHp, setUiHp] = useState(100)
  const [uiKills, setUiKills] = useState(0)
  const [uiCountdown, setUiCountdown] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true

    document.body.style.overflow = 'hidden'

    function syncUI() {
      setUiWave(waveRef.current)
      setUiHp(Math.max(0, Math.floor(hpRef.current)))
      setUiKills(killsRef.current)
      setUiCountdown(
        waveClearedRef.current ? countdownRef.current : null
      )
    }

    function spawnWave() {
      enemies.current = []
      const w = waveRef.current
      const count = Math.min(3 + w, 8)

      for (let i = 0; i < count; i++) {
        enemies.current.push({
          x: Math.random() * 760 + 20,
          y: Math.random() * 460 + 20,
          hp: 25 + w * 6,
          speed: 0.6 + w * 0.05,
          r: 14
        })
      }

      waveClearedRef.current = false
      syncUI()
    }

    spawnWave()

    function attack(ts) {
      if (ts - lastAttackRef.current < 400) return
      if (!enemies.current.length) return

      // closest enemy
      let target = enemies.current[0]
      let best = Infinity
      enemies.current.forEach(e => {
        const d = Math.hypot(
          e.x - player.current.x,
          e.y - player.current.y
        )
        if (d < best) {
          best = d
          target = e
        }
      })

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

    function loop(ts) {
      if (!running) return

      // -------- MOVE --------
      if (movingRef.current) {
        player.current.x += moveVecRef.current.x
        player.current.y += moveVecRef.current.y
      }

      player.current.x = Math.max(20, Math.min(780, player.current.x))
      player.current.y = Math.max(20, Math.min(480, player.current.y))

      // -------- UPDATE --------
      bullets.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
      })

      enemies.current.forEach(e => {
        const dx = player.current.x - e.x
        const dy = player.current.y - e.y
        const d = Math.hypot(dx, dy)

        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        if (d < e.r + 12) {
          hpRef.current -= 0.15
        }
      })

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
          killsRef.current++
          return false
        }
        return true
      })

      // -------- WAVE --------
      if (enemies.current.length === 0 && !waveClearedRef.current) {
        waveClearedRef.current = true
        countdownRef.current = 3
        countdownTimerRef.current = 0
        syncUI()
      }

      if (waveClearedRef.current) {
        countdownTimerRef.current += 1 / 60
        if (countdownTimerRef.current >= 1) {
          countdownRef.current--
          countdownTimerRef.current = 0
          syncUI()
        }
        if (countdownRef.current <= 0) {
          waveRef.current++
          spawnWave()
        }
      }

      // -------- DRAW --------
      ctx.clearRect(0, 0, 800, 500)

      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fff'
      bullets.current.forEach(b => {
        ctx.beginPath()
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#ff4444'
      enemies.current.forEach(e => {
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()
      })

      syncUI()

      if (hpRef.current <= 0) {
        running = false
        onGameOver(
          waveRef.current * 100 + killsRef.current * 10
        )
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    // -------- INPUT --------

    // PC
    const keys = {}
    setInterval(() => {
      moveVecRef.current = { x: 0, y: 0 }
      if (keys['w'] || keys['ArrowUp']) moveVecRef.current.y -= 3
      if (keys['s'] || keys['ArrowDown']) moveVecRef.current.y += 3
      if (keys['a'] || keys['ArrowLeft']) moveVecRef.current.x -= 3
      if (keys['d'] || keys['ArrowRight']) moveVecRef.current.x += 3
      movingRef.current =
        moveVecRef.current.x !== 0 ||
        moveVecRef.current.y !== 0
    }, 16)

    window.addEventListener('keydown', e => {
      keys[e.key] = true
      if (e.code === 'Space') attack(performance.now())
    })
    window.addEventListener('keyup', e => {
      keys[e.key] = false
    })

    // -------- MOBILE (FIXED) --------
    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      touchStartTimeRef.current = performance.now()
      touchAnchorRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      movingRef.current = true
    })

    canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      if (!touchAnchorRef.current) return

      const t = e.touches[0]
      const dx = t.clientX - touchAnchorRef.current.x
      const dy = t.clientY - touchAnchorRef.current.y
      const len = Math.hypot(dx, dy) || 1

      moveVecRef.current = {
        x: (dx / len) * 2.5,
        y: (dy / len) * 2.5
      }
    })

    canvas.addEventListener('touchend', e => {
      e.preventDefault()
      movingRef.current = false
      moveVecRef.current = { x: 0, y: 0 }

      const tapTime =
        performance.now() - touchStartTimeRef.current
      if (tapTime < 200) {
        attack(performance.now())
      }

      touchAnchorRef.current = null
    })

    return () => {
      running = false
      document.body.style.overflow = ''
    }
  }, [onGameOver])

  return (
    <>
      <div style={{ marginBottom: 6 }}>
        ❤️ {uiHp} &nbsp;
        🌊 Wave {uiWave} &nbsp;
        💀 {uiKills}
        {uiCountdown !== null && (
          <span> — Next wave in {uiCountdown}</span>
        )}
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
