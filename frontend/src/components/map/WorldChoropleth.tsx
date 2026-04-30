import * as d3 from 'd3'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import { useEffect, useRef, useState } from 'react'

interface Datum {
  countryCode: string
  per100k: number
}

interface Props {
  data: Datum[]
  selectedCode?: string
  onSelect?: (code: string | null) => void
  compact?: boolean
}

export function WorldChoropleth({
  data,
  selectedCode,
  onSelect,
  compact,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 400 })
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null)
  const [hover, setHover] = useState<{
    code: string
    name: string
    value?: number
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setSize({
          w: Math.floor(e.contentRect.width),
          h: Math.floor(e.contentRect.height),
        })
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        if (cancelled) return
        const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>
        setGeo(fc)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!geo)
    return (
      <div ref={wrapRef} className="w-full h-full grid place-items-center text-ink-dim text-xs">
        Chargement de la carte...
      </div>
    )

  const projection = d3
    .geoNaturalEarth1()
    .fitSize([size.w, size.h], geo)
  const path = d3.geoPath(projection)

  const max = d3.max(data, d => d.per100k) ?? 1
  const color = d3
    .scaleSequential(d3.interpolateCubehelixLong('#0e1822', '#7ee0d2'))
    .domain([0, max])

  const valueByCode = new Map(data.map(d => [d.countryCode, d.per100k]))

  return (
    <div ref={wrapRef} className="w-full h-full relative">
      <svg width={size.w} height={size.h}>
        <g>
          {geo.features.map((f, i) => {
            const code = (f.properties as { iso_a3?: string; name?: string })?.iso_a3 ??
              (f as unknown as { id: string }).id
            const v = valueByCode.get(code)
            const fill = v != null ? color(v) : '#0e1822'
            const isSelected = selectedCode === code
            return (
              <path
                key={i}
                d={path(f) ?? ''}
                fill={fill}
                stroke={isSelected ? '#9af2e4' : '#1f2735'}
                strokeWidth={isSelected ? 1.5 : 0.4}
                className="transition-all cursor-pointer hover:stroke-accent"
                onMouseMove={e => {
                  const rect = wrapRef.current?.getBoundingClientRect()
                  setHover({
                    code,
                    name: (f.properties as { name?: string })?.name ?? code,
                    value: v,
                    x: e.clientX - (rect?.left ?? 0),
                    y: e.clientY - (rect?.top ?? 0),
                  })
                }}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(code)}
              />
            )
          })}
        </g>
      </svg>
      {hover && !compact && (
        <div
          className="pointer-events-none absolute panel px-3 py-2 text-xs"
          style={{ left: hover.x + 12, top: hover.y + 12 }}
        >
          <div className="font-display text-ink">{hover.name}</div>
          {hover.value != null ? (
            <div className="text-ink-mute font-mono mt-0.5">
              {hover.value.toLocaleString('fr')} / 100k
            </div>
          ) : (
            <div className="text-ink-dim text-[10px] mt-0.5">données indisponibles</div>
          )}
        </div>
      )}
      {!compact && (
        <Legend max={max} colorFn={color} />
      )}
    </div>
  )
}

function Legend({
  max,
  colorFn,
}: {
  max: number
  colorFn: d3.ScaleSequential<string>
}) {
  const stops = 24
  return (
    <div className="absolute bottom-3 left-3 bg-bg-panel/80 backdrop-blur border border-line/70 rounded-lg p-2 text-[10px] text-ink-mute">
      <div className="flex items-center gap-1.5">
        <span className="font-mono">0</span>
        <div className="flex h-3 w-32">
          {Array.from({ length: stops }).map((_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ backgroundColor: colorFn((i / (stops - 1)) * max) }}
            />
          ))}
        </div>
        <span className="font-mono">{d3.format('.2s')(max)}</span>
      </div>
      <div className="text-center text-[9px] uppercase tracking-wider mt-1 text-ink-dim">
        cas / 100k habitants
      </div>
    </div>
  )
}
