import { useRef, useEffect } from 'react'

export default function ArenaControls({ setInput, containerRef }) {
  const activeRef = useRef(false)
  const centerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Reset input on unmount
    return () => {
      setInput(i => ({ ...i, dx: 0, dy: 0, attack: false }))
    }
  }, [setInput])

  function onTouchStart(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const t = e.touches[0]

    activeRef.current = true
    centerRef.current = {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    }
  }

  function onTouchMove(e) {
    if (!activeRef.current || !containerRef.current) return
    e.preventDefault()
    e.stopPropagation()

    const rect = containerRef.current.getBoundingClientRect()
    const t = e.touches[0]

    const x = t.clientX - rect.left
    const y = t.clientY - rect.top

    const dx = x - centerRef.current.x
    const dy = y - centerRef.current.y

    const dist = Math.hypot(dx, dy)
    const max = 40

    if (dist < 6) {
      setInput(i => ({ ...i, dx: 0, dy: 0 }))
      return
    }

    setInput(i => ({
      ...i,
      dx: Math.max(-1, Math.min(1, dx / max)),
      dy: Math.max(-1, Math.min(1, dy / max))
    }))
  }

  function onTouchEnd(e) {
    e.preventDefault()
    e.stopPropagation()

    activeRef.current = false
    setInput(i => ({ ...i, dx: 0, dy: 0 }))
  }

  return (
    <>
      {/* JOYSTICK ZONE */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'absolute',
          left: 16,
          bottom: 16,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          touchAction: 'none',
          userSelect: 'none'
        }}
      />

      {/* ATTACK BUTTON */}
      <button
        onTouchStart={e => {
          e.preventDefault()
          e.stopPropagation()
          setInput(i => ({ ...i, attack: true }))
        }}
        onTouchEnd={e => {
          e.preventDefault()
          e.stopPropagation()
          setInput(i => ({ ...i, attack: false }))
        }}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: '#ff7a00',
          border: 'none',
          fontSize: 28,
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        🔥
      </button>
    </>
  )
}
