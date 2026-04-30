import { useEffect, useState } from 'react'

interface Props {
  end: number
  duration?: number
  decimals?: number
}

export function CountUp({ end, duration = 1.4, decimals = 0 }: Props) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 3)
      setV(end * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration])
  return <>{v.toFixed(decimals)}</>
}
