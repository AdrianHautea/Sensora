import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function LineChart({ data = [], width = 900, height = 260, padding = 32 }) {
  if (!data || data.length === 0) {
    return <div style={{ color: '#94a3b8' }}>No data</div>
  }

  // prepare points
  const points = useMemo(
    () => data.map(d => ({ t: new Date(d.time).getTime(), v: d.score, raw: d })),
    [data]
  )
  const tMin = Math.min(...points.map(p => p.t))
  const tMax = Math.max(...points.map(p => p.t))
  const vMin = Math.min(...points.map(p => p.v))
  const vMax = Math.max(...points.map(p => p.v))

  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const xFor = (t) => (tMax === tMin ? padding + innerW / 2 : padding + ((t - tMin) / (tMax - tMin)) * innerW)
  const yFor = (v) => (vMax === vMin ? padding + innerH / 2 : padding + (1 - (v - vMin) / (vMax - vMin)) * innerH)

  // path (straight lines)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.t)} ${yFor(p.v)}`).join(' ')

  const areaD = `${pathD} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`

  const pathRef = useRef(null)
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  // stroke-draw animation
  const [dashOffset, setDashOffset] = useState(null)
  useEffect(() => {
    const pathEl = pathRef.current
    if (!pathEl) return
    const len = pathEl.getTotalLength()
    // start hidden
    setDashOffset(len)
    // animate to 0
    const raf = requestAnimationFrame(() => {
      // small timeout to ensure layout
      setTimeout(() => setDashOffset(0), 40)
    })
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [pathD, data.length])

  const [areaOpacity, setAreaOpacity] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAreaOpacity(0.18), 120)
    return () => clearTimeout(t)
  }, [pathD])

  // tooltip state
  const [hover, setHover] = useState({ visible: false, x: 0, y: 0, idx: 0, clientX: 0, clientY: 0 })

  function handleMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const clientX = e.clientX
    const clientY = e.clientY
    const relX = ((clientX - rect.left) / rect.width) * width
    // find nearest point by x distance
    let nearest = 0
    let bestDist = Infinity
    points.forEach((p, i) => {
      const dx = Math.abs(xFor(p.t) - relX)
      if (dx < bestDist) {
        bestDist = dx
        nearest = i
      }
    })
    const p = points[nearest]
    setHover({
      visible: true,
      x: xFor(p.t),
      y: yFor(p.v),
      idx: nearest,
      clientX,
      clientY,
      datum: p.raw,
    })
  }

  function handleLeave() {
    setHover(h => ({ ...h, visible: false }))
  }

  // compute three x-axis labels
  const xLabels = useMemo(() => {
    const mid = Math.round((tMin + tMax) / 2)
    return [
      { t: tMin, label: new Date(tMin).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { t: mid, label: new Date(mid).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
      { t: tMax, label: new Date(tMax).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
    ]
  }, [tMin, tMax])

  // small helper for tooltip placement inside container
  const tooltipStyle = (() => {
    if (!hover.visible) return { display: 'none' }
    const rect = containerRef.current ? containerRef.current.getBoundingClientRect() : { left: 0, top: 0 }
    const left = hover.clientX - rect.left + 12
    const top = hover.clientY - rect.top - 10
    return {
      position: 'absolute',
      left,
      top,
      transform: 'translateY(-100%)',
      background: 'rgba(6,8,15,0.92)',
      color: '#fff',
      padding: '8px 10px',
      borderRadius: 8,
      fontSize: 12,
      pointerEvents: 'none',
      boxShadow: '0 8px 22px rgba(2,6,23,0.6)',
      whiteSpace: 'nowrap',
      zIndex: 1000,
    }
  })()

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: width }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ maxWidth: '100%', display: 'block', overflow: 'visible' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid lines */}
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

        <path
          d={areaD}
          fill="url(#areaGrad)"
          style={{ opacity: areaOpacity, transition: 'opacity 900ms ease-out' }}
        />

        {/* main line */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: dashOffset == null ? 'none' : `${dashOffset}`,
            strokeDashoffset: dashOffset == null ? 0 : dashOffset,
            transition: dashOffset == null ? 'none' : 'stroke-dashoffset 1100ms cubic-bezier(.2,.9,.2,1)',
            filter: 'drop-shadow(0 6px 18px rgba(124,58,237,0.12))',
          }}
        />

        {/* points */}
        {points.map((p, i) => {
          const x = xFor(p.t)
          const y = yFor(p.v)
          const datum = p.raw
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4.5} fill="#fff" stroke="#7dd3fc" strokeWidth="1.4" style={{ transition: 'transform 140ms ease, r 140ms ease' }} />
              <title>{`${new Date(datum.time).toLocaleString()} — ${datum.score}`}</title>
            </g>
          )
        })}

        {/* highlight dot that follows hover */}
        {hover.visible && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={padding} y2={padding + innerH} stroke="#ffffff22" strokeDasharray="4 6" />
            <circle cx={hover.x} cy={hover.y} r={6.5} fill="#fff" stroke="#7dd3fc" strokeWidth="2.2" />
          </g>
        )}

        {/* x axis labels */}
        {xLabels.map((xl, i) => {
          const x = xFor(xl.t)
          return <text key={i} x={x} y={height - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">{xl.label}</text>
        })}
      </svg>

      {/* tooltip */}
      <div style={tooltipStyle}>
        <div style={{ fontSize: 12, opacity: 0.9 }}>{new Date(hover.datum?.time).toLocaleString()}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>{hover.datum?.score} / 100</div>
      </div>
    </div>
  )
}