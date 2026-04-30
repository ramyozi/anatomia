import * as d3 from 'd3'
import { useMemo, useRef, useState, useEffect } from 'react'

interface Point {
  year: number
  cases: number
}

export function TimelineChart({
  data,
  height = 220,
  color = '#7ee0d2',
}: {
  data: Point[]
  height?: number
  color?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setWidth(Math.floor(e.contentRect.width))
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const margin = { top: 18, right: 14, bottom: 30, left: 50 }
  const chart = useMemo(() => {
    const w = Math.max(width - margin.left - margin.right, 100)
    const h = height - margin.top - margin.bottom
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, w])
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.cases) ?? 1])
      .nice()
      .range([h, 0])
    const line = d3
      .line<Point>()
      .x(d => x(d.year))
      .y(d => y(d.cases))
      .curve(d3.curveMonotoneX)
    const area = d3
      .area<Point>()
      .x(d => x(d.year))
      .y0(h)
      .y1(d => y(d.cases))
      .curve(d3.curveMonotoneX)
    return { w, h, x, y, line, area }
  }, [data, width, height])

  return (
    <div ref={wrapRef} className="w-full">
      <svg width="100%" height={height} className="overflow-visible">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* grid */}
          {chart.y.ticks(4).map(t => (
            <g key={t} transform={`translate(0,${chart.y(t)})`}>
              <line x2={chart.w} stroke="#1f2735" strokeDasharray="2,3" />
              <text
                x={-8}
                dy="0.32em"
                textAnchor="end"
                className="text-[10px] fill-ink-dim font-mono"
              >
                {d3.format('.2s')(t)}
              </text>
            </g>
          ))}
          {/* x ticks */}
          {chart.x.ticks(Math.min(data.length, 8)).map(t => (
            <text
              key={t}
              x={chart.x(t)}
              y={chart.h + 20}
              textAnchor="middle"
              className="text-[10px] fill-ink-dim font-mono"
            >
              {t}
            </text>
          ))}
          {/* area + line */}
          <defs>
            <linearGradient id="ta" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chart.area(data) ?? ''} fill="url(#ta)" />
          <path
            d={chart.line(data) ?? ''}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          {/* points */}
          {data.map((p, i) => (
            <circle
              key={i}
              cx={chart.x(p.year)}
              cy={chart.y(p.cases)}
              r={hoverIdx === i ? 4.5 : 2.5}
              fill={color}
              className="transition-all cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          ))}
          {hoverIdx != null && (
            <g
              transform={`translate(${chart.x(data[hoverIdx].year)},${chart.y(data[hoverIdx].cases) - 12})`}
            >
              <rect
                x={-44}
                y={-22}
                width={88}
                height={20}
                rx={4}
                fill="#10151f"
                stroke="#1f2735"
              />
              <text
                textAnchor="middle"
                y={-8}
                className="text-[10px] fill-ink font-mono"
              >
                {data[hoverIdx].year}: {d3.format('.3s')(data[hoverIdx].cases)}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
