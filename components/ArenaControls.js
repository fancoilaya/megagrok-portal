import { useEffect } from 'react'

export default function ArenaControls({ setInput }) {
  useEffect(() => {
    let active = false
    let start = { x: 0, y: 0 }

    function move(e) {
      if (!active) return
      const dx = (e.touches[0].clientX - start.x) / 50
      const dy = (e.touches[0].clientY - start.y) / 50
      setInput(i => ({ ...i, dx, dy }))
    }

    function startMove(e) {
      active = true
      start = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    }

    function endMove() {
      active = false
      setInput(i => ({ ...i, dx: 0, dy: 0 }))
    }

    document.getElementById('joystick')?.addEventListener('touchstart', startMove)
    document.getElementById('joystick')?.addEventListener('touchmove', move)
    document.getElementById('joystick')?.addEventListener('touchend', endMove)

    return () => {}
  }, [setInput])

  return (
    <>
      <div id="joystick" style={joyStyle}>
        <div style={knobStyle} />
      </div>

      <button
        style={attackStyle}
        onTouchStart={() => setInput(i => ({ ...i, attack: true }))}
        onTouchEnd={() => setInput(i => ({ ...i, attack: false }))}
      >
        🔥
      </button>
    </>
  )
}

const joyStyle = {
  position: 'fixed',
  bottom: 20,
  left: 20,
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  touchAction: 'none'
}

const knobStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#fff',
  position: 'absolute',
  top: 30,
  left: 30
}

const attackStyle = {
  position: 'fixed',
  bottom: 30,
  right: 30,
  width: 80,
  height: 80,
  borderRadius: '50%',
  fontSize: 24,
  background: '#ff7a00',
  color: '#000'
}
