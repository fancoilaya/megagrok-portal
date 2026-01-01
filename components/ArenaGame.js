import { useRef, useEffect, useState } from 'react'

export default function ArenaGame({ onGameOver }) {
  const canvasRef = useRef(null)

  // -------- GAME STATE (PLAIN JS) --------
  let player = { x: 400, y: 250 }
  let enemies = []
  let bullets = []

  let wave = 1
  let hp = 100
  let kills = 0

  let lastAttack = 0
  let waveCleared = false
  let countdown = 3
  let countdownTimer = 0

  let moving = false
  let moveVec = { x: 0, y: 0 }

  // -------- UI STATE (REACT, READ-ONLY) --------
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
      setUiWave(wave)
      setUiHp(Math.max(0, Math.floor(hp)))
      setUiKills(kills)
      setUiCountdown(waveCleared ? countdown : null)
    }

    function spawnWave() {
      enemies = []
      const count = Math.min(3 + wave, 8)
      for (let i = 0; i < count; i++) {
        enemies.push({
          x: Math.random() * 760 + 20,
          y: Math.random() * 460 + 20,
          hp: 25 + wave * 6,
          speed: 0.6 + wave * 0.05,
          r: 14
        })
      }
      waveCleared = false
      syncUI()
    }

    spawnWave()

    function attack(ts) {
      if (ts - lastAttack < 400) return
      if (!enemies.length) return

      const e = enemies[0]
      const dx = e.x - player.x
      const dy = e.y - player.y
      const d = Math.hypot(dx, dy)

      bullets.push({
        x: player.x,
        y: player.y,
        vx: (dx / d) * 6,
        vy: (dy / d) * 6
      })

      lastAttack = ts
    }

    function loop(ts) {
      if (!running) return

      // -------- MOVEMENT --------
      if (moving) {
        player.x += moveVec.x * 3
        player.y += moveVec.y * 3
      }

      player.x = Math.max(20, Math.min(780, player.x))
      player.y = Math.max(20, Math.min(480, player.y))

      // -------- UPDATE --------
      bullets.forEach(b => {
        b.x += b.vx
        b.y += b.vy
      })

      enemies.forEach(e => {
        const dx = player.x - e.x
        const dy = player.y - e.y
        const d = Math.hypot(dx, dy)

        e.x += (dx / d) * e.speed
        e.y += (dy / d) * e.speed

        if (d < e.r + 12) {
          hp -= 0.15
        }
      })

      bullets.forEach(b => {
        enemies.forEach(e => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.r) {
            e.hp -= 10
            b.dead = true
          }
        })
      })

      bullets = bullets.filter(b => !b.dead)
      enemies = enemies.filter(e => {
        if (e.hp <= 0) {
          kills++
          return false
        }
        return true
      })

      // -------- WAVE LOGIC --------
      if (enemies.length === 0 && !waveCleared) {
        waveCleared = true
        countdown = 3
        countdownTimer = 0
        syncUI()
      }

      if (waveCleared) {
        countdownTimer += 1 / 60
        if (countdownTimer >= 1) {
          countdown--
          countdownTimer = 0
          syncUI()
        }
        if (countdown <= 0) {
          wave++
          spawnWave()
        }
      }

      // -------- DRAW --------
      ctx.clearRect(0, 0, 800, 500)

      ctx.fillStyle = '#ff7a00'
      ctx.beginPath()
      ctx.arc(player.x, player.y, 14, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fff'
      bullets.forEach(b => {
        ctx.beginPath()
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#ff4444'
      enemies.forEach(e => {
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // -------- GAME OVER --------
      syncUI()
      if (hp <= 0) {
        running = false
        onGameOver(wave * 100 + kills * 10)
        return
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    // -------- INPUT --------

    // PC
    const keys = {}
    setInterval(() => {
      moveVec = { x: 0, y: 0 }
      if (keys['w'] || keys['ArrowUp']) moveVec.y -= 1
      if (keys['s'] || keys['ArrowDown']) moveVec.y += 1
      if (keys['a'] || keys['ArrowLeft']) moveVec.x -= 1
      if (keys['d'] || keys['ArrowRight']) moveVec.x += 1
      moving = moveVec.x !== 0 || moveVec.y !== 0
    }, 16)

    window.addEventListener('keydown', e => {
      keys[e.key] = true
      if (e.code === 'Space') attack(performance.now())
    })

    window.addEventListener('keyup', e => {
      keys[e.key] = false
    })

    // Mobile: drag = move, tap = attack
    let lastTouch = null

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      if (e.touches.length > 1) {
        attack(performance.now())
        return
      }
      lastTouch = e.touches[0]
      moving = true
    })

    canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      if (!lastTouch) return
      const t = e.touches[0]
      moveVec = {
        x: (t.clientX - lastTouch.clientX) / 20,
        y: (t.clientY - lastTouch.clientY) / 20
      }
      lastTouch = t
    })

    canvas.addEventListener('touchend', e => {
      e.preventDefault()
      moving = false
      moveVec = { x: 0, y: 0 }
      lastTouch = null
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
        {uiCountdown !== null && <span> — Next wave in {uiCountdown}</span>}
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
