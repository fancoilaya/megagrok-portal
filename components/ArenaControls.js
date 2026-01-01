import { useRef } from 'react'

export default function ArenaControls({ setInput }) {
  const activeRef = useRef(false)
  const centerRef = useRef({ x: 0, y: 0 })

  function onStart(e) {
    e.preventDefault()
    const t = e.touches[0]
    activeRef.current = true
    centerRef.current = { x: t.clientX, y: t.clientY }
  }

  function onMove(e) {
    if (!activeRef.current) return
    e.preventDefault()

    const t = e.touches[0]
    const dx = t.clientX - centerRef.current.x
    const dy = t.clientY - centerRef.current.y

    // normalize vector
    const len = Math.hypot(dx, dy)
    if (len < 10) {
      setInput(i => ({ ...i, dx: 0, dy: 0 }))
      return
    }

    const nx = dx / Math.min(len, 40)
    const ny = dy / Math.min(len, 40)

    setInput(i => ({
      ...i,
      dx: Math.max(-1, Math.min(1, nx)),
      dy: Math.max(-1, Math.min(1, ny))
    }))
  }

  function onEnd() {
    activeRef.current = false
    setInput(i => ({ ...i, dx: 0, dy: 0 }))
  }

  return (
    <>
      {/* JOYSTICK */}
      <div
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          touchAction: 'none'
        }}
      />

      {/* ATTACK BUTTON */}
      <button
        onTouchStart={e => {
          e.preventDefault()
          setInput(i => ({ ...i, attack: true }))
        }}
        onTouchEnd={e => {
          e.preventDefault()
          setInput(i => ({ ...i, attack: false }))
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: '#ff7a00',
          border: 'none',
          fontSize: 28,
          touchAction: 'none'
        }}
      >
        🔥
      </button>
    </>
  )
}
