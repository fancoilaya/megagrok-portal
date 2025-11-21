import { useEffect, useState } from 'react'
export default function Countdown({ target }) {
  const [remaining, setRemaining] = useState(calcRemaining())
  function calcRemaining(){
    const diff = Math.max(0, new Date(target) - new Date())
    const s = Math.floor(diff/1000) % 60
    const m = Math.floor(diff/60000) % 60
    const h = Math.floor(diff/3600000) % 24
    const d = Math.floor(diff/86400000)
    return {d,h,m,s}
  }
  useEffect(()=>{
    const t = setInterval(()=>setRemaining(calcRemaining()), 1000)
    return ()=>clearInterval(t)
  },[target])
  return <div className="countdown">CA Launch in: {remaining.d}d {remaining.h}h {remaining.m}m {remaining.s}s</div>
}
