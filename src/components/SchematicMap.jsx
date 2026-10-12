import { MAP, PLACES, TRANSIT_STOPS, L, MODES } from '../data.js'
import { co2Of, duration, grams, reversePath } from '../lib/calc.js'

// Схемалық карта: интернетсіз жұмыс істейді, APK ішінде де ашылады.
// Тор көшелері, саябақ, өзен және әр көлік түрінің өз бағыты.
const colEdges = [0, 60, 140, 212, 284, 340]
const rowEdges = [0, 52, 104, 156, 206, 240]

const blocks = []
colEdges.slice(0, -1).forEach((x, i) => {
  rowEdges.slice(0, -1).forEach((y, j) => {
    const w = colEdges[i + 1] - x
    const h = rowEdges[j + 1] - y
    // Саябақ аймағындағы блоктарды өткізіп жібереміз
    const inPark = x + w / 2 > 94 && x + w / 2 < 218 && y + h / 2 > 24 && y + h / 2 < 110
    if (inPark) return
    blocks.push({ x: x + 9, y: y + 9, w: w - 18, h: h - 18, key: `${i}-${j}` })
  })
})

export default function SchematicMap({ lang, routes, selectedId, onSelect, rates, swapped = false }) {
  const selected = routes.find((r) => r.id === selectedId)
  const selectedMode = selected ? MODES[selected.mode] : null
  const showStops = selectedMode && ['bus', 'metro', 'trolley'].includes(selectedMode.id)
  // Ауыстыру батырмасы басылса — нүктелер мен жолдар да кері айналады
  const [placeA, placeB] = swapped ? [PLACES[1], PLACES[0]] : [PLACES[0], PLACES[1]]
  const pathOf = (route) => (swapped ? reversePath(route.path) : route.path)

  return (
    <div className="map-wrap">
      <svg className="map" viewBox={`0 0 ${MAP.width} ${MAP.height}`} role="img" aria-label="Схемалық карта">
        <defs>
          <linearGradient id="parkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--park-a)" />
            <stop offset="100%" stopColor="var(--park-b)" />
          </linearGradient>
          <filter id="markerShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.6" stdDeviation="1.8" floodColor="#0b3d2c" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect x="0" y="0" width={MAP.width} height={MAP.height} fill="var(--map-bg)" />

        {blocks.map((b) => (
          <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill="var(--map-block)" />
        ))}

        <path d={MAP.park} fill="url(#parkFill)" opacity="0.95" />
        <text x="128" y="42" className="map-park-label" textAnchor="middle">
          {lang === 'kk' ? 'Саябақ' : 'Парк'}
        </text>

        {MAP.streets.map((s, i) => (
          <path
            key={i}
            d={s.d}
            stroke="var(--map-street)"
            strokeWidth={s.w}
            strokeLinecap="round"
            fill="none"
          />
        ))}

        <path d={MAP.river} stroke="var(--map-river)" strokeWidth="9" fill="none" opacity="0.55" strokeLinecap="round" />

        {/* Бағыттар: әр көлік түрі — өз түсімен */}
        {routes.map((route) => {
          const mode = MODES[route.mode]
          const isSelected = route.id === selectedId
          const anySelected = Boolean(selectedId)
          return (
            <g key={route.id} className="map-route">
              <path
                d={pathOf(route)}
                stroke="transparent"
                strokeWidth="18"
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(route.id)}
              />
              <path
                d={pathOf(route)}
                stroke={mode.color}
                strokeWidth={isSelected ? 5.4 : 3.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={route.mode === 'walk' ? '1.5 5.5' : undefined}
                opacity={isSelected ? 1 : anySelected ? 0.22 : 0.6}
                fill="none"
                pointerEvents="none"
              />
            </g>
          )
        })}

        {showStops &&
          TRANSIT_STOPS.map((s) => (
            <g key={s.id} pointerEvents="none">
              <circle cx={s.x} cy={s.y} r="3.6" fill="#fff" stroke={selectedMode.color} strokeWidth="2.2" />
            </g>
          ))}

        {/* А және В нүктелері */}
        {[placeA, placeB].map((p, i) => (
          <g key={p.id} pointerEvents="none" filter="url(#markerShadow)">
            <circle cx={p.x} cy={p.y} r="9" fill={i === 0 ? '#0b3d2c' : '#16a34a'} />
            <text x={p.x} y={p.y + 3.6} textAnchor="middle" className="map-marker-text" fill="#ffffff">
              {i === 0 ? 'A' : 'B'}
            </text>
            <text
              x={p.x}
              y={i === 0 ? p.y + 22 : p.y - 14}
              textAnchor="middle"
              className="map-place-label"
            >
              {L(p.name, lang)}
            </text>
          </g>
        ))}
      </svg>

      {selected && (
        <div className="map-badge" style={{ borderColor: selectedMode.color }}>
          <span className="map-badge-dot" style={{ background: selectedMode.color }} />
          <span className="map-badge-title">{L(selected.title, lang)}</span>
          <span className="map-badge-meta">
            {duration(selected.minutes, lang)} · {grams(co2Of(selected, rates))}
          </span>
        </div>
      )}
    </div>
  )
}
