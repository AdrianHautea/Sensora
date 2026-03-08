import React from 'react'

export default function LineChart({ data = [], width = 900, height = 260, padding = 32 }) {
  if (!data || data.length === 0) {
    return <div style={{ color: '#94a3b8' }}>No data</div>
  }

  const points = data.map(d => ({ t: new Date(d.time).getTime(), v: d.score }))
  const tMin = Math.min(...points.map(p => p.t))
  const tMax = Math.max(...points.map(p => p.t))
  const vMin = Math.min(...points.map(p => p.v))
  const vMax = Math.max(...points.map(p => p.v))

  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const xFor = (t) => (tMax === tMin ? padding + innerW / 2 : padding + ((t - tMin) / (tMax - tMin)) * innerW)
  const yFor = (v) => (vMax === vMin ? padding + innerH / 2 : padding + (1 - (v - vMin) / (vMax - vMin)) * innerH)

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.t)} ${yFor(p.v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ maxWidth: '100%' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padding + t * innerH
        const labelV = Math.round(vMax - t * (vMax - vMin))
        return (
          <g key={i}>
            <line x1={padding} x2={padding + innerW} y1={y} y2={y} stroke="#0f172a17" strokeWidth="1" />
            <text x={6} y={y + 4} fontSize="10" fill="#94a3b8">{labelV}</text>
          </g>
        )
      })}

      <path d={pathD} fill="none" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      <path
        d={`${pathD} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`}
        fill="url(#lineGrad)"
        opacity="0.18"
      />

      {points.map((p, i) => {
        const x = xFor(p.t)
        const y = yFor(p.v)
        const datum = data[i]
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4.5} fill="#fff" stroke="#7dd3fc" strokeWidth="1.8" />
            <title>{`${new Date(datum.time).toLocaleString()} — ${datum.score}`}</title>
          </g>
        )
      })}

      {[
        [tMin, 0],
        [(tMin + tMax) / 2, 0.5],
        [tMax, 1],
      ].map(([t], i) => {
        const x = xFor(t)
        const label = new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
        return <text key={i} x={x} y={height - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">{label}</text>
      })}
    </svg>
  )
}