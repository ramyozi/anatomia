import * as d3 from 'd3'
import { useMemo, useRef, useState, useEffect } from 'react'

interface Datum {
  label: string
  value: number
}

export function BarChart({
  data,
  height = 280,
  color = '#7ee0d2',
}: {
  data: Datum[]
  height?: number
  color?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(600)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(Math.floor(e.contentRect.width))
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const m = { top: 8, right: 12, bottom: 8, left: 140 }
  const innerW = Math.max(w - m.left - m.right, 100)
  const innerH = data.length * 24

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value) ?? 1])
        .nice()
        .range([0, innerW]),
    [data, innerW],
  )

  return (
    <div ref={wrapRef}>
      <svg width="100%" height={Math.max(innerH + m.top + m.bottom, height)}>
        <g transform={`translate(${m.left},${m.top})`}>
          {data.map((d, i) => {
            const y = i * 22
            return (
              <g key={d.label} transform={`translate(0,${y})`}>
                <text
                  x={-8}
                  y={9}
                  textAnchor="end"
                  className="text-[11px] fill-ink-mute"
                >
                  {d.label.length > 18 ? d.label.slice(0, 17) + '…' : d.label}
                </text>
                <rect
                  x={0}
                  y={0}
                  width={innerW}
                  height={14}
                  fill="#0e1620"
                  rx={3}
                />
                <rect
                  x={0}
                  y={0}
                  width={x(d.value)}
                  height={14}
                  fill={color}
                  fillOpacity="0.8"
                  rx={3}
                  className="transition-all"
                >
                  <title>{`${d.label}: ${d.value.toLocaleString('fr')}`}</title>
                </rect>
                <text
                  x={x(d.value) + 6}
                  y={9}
                  className="text-[10px] fill-ink-mute font-mono"
                >
                  {d3.format('.3s')(d.value)}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
