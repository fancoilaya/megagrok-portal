export default function ArenaControls({ setInput }) {
  let active = false
  let start = { x: 0, y: 0 }

  function startMove(e) {
    e.preventDefault()
    active = true
    start = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  function move(e) {
    if (!active) return
    e.preventDefault()
    const dx = (e.touches[0].clientX - start.x) / 50
    const dy = (e.touches[0].clientY - start.y) / 50
    setInput(i => ({ ...i, dx, dy }))
  }

  function endMove() {
    active = false
    setInput(i => ({ ...i, dx: 0, dy: 0 }))
  }

  return (
    <>
      <div
        onTouchStart={startMove}
        onTouchMove={move}
        onTouchEnd={endMove}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          touchAction: 'none'
        }}
      />

      <button
        onTouchStart={e => {
          e.preventDefault()
          setInput(i => ({ ...i, attack: true }))
        }}
        onTouchEnd={() => setInput(i => ({ ...i, attack: false }))}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#ff7a00',
          border: 'none',
          fontSize: 24,
          touchAction: 'none'
        }}
      >
        🔥
      </button>
    </>
  )
}
