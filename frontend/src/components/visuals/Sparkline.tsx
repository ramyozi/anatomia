import * as d3 from 'd3'
import { useMemo } from 'react'

interface Props {
  values: number[]
  width?: number
  height?: number
  color?: string
  fill?: string
}

export function Sparkline({
  values,
  width = 80,
  height = 28,
  color = '#7ee0d2',
  fill = 'rgba(126,224,210,0.18)',
}: Props) {
  const path = useMemo(() => {
    if (!values.length) return ''
    const x = d3
      .scaleLinear()
      .domain([0, values.length - 1])
      .range([1, width - 1])
    const y = d3
      .scaleLinear()
      .domain(d3.extent(values) as [number, number])
      .nice()
      .range([height - 1, 1])
    const line = d3
      .line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX)
    return line(values) ?? ''
  }, [values, width, height])

  const area = useMemo(() => {
    if (!values.length) return ''
    const x = d3
      .scaleLinear()
      .domain([0, values.length - 1])
      .range([1, width - 1])
    const y = d3
      .scaleLinear()
      .domain(d3.extent(values) as [number, number])
      .nice()
      .range([height - 1, 1])
    const a = d3
      .area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX)
    return a(values) ?? ''
  }, [values, width, height])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  )
}
