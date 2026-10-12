// Есеп логикасы — бүкіл қосымша осы функцияларды қолданады,
// сондықтан коэффициент өзгергенде барлық экран бірдей қайта есептеледі.
import { MODES } from '../data.js'

/** Бағыттың шығарындысы: CO₂ = қашықтық (км) × коэффициент (г/км) */
export const co2Of = (route, rates) => Math.round(route.distance * (rates[route.mode] ?? 0))

/** Көлікпен салыстырғандағы үнем (г CO₂) */
export const savedVsCar = (route, rates) =>
  Math.max(0, Math.round(route.distance * ((rates.car ?? 0) - (rates[route.mode] ?? 0))))

export const modeOf = (route) => MODES[route.mode]

/** 1 234,5 түріндегі сан */
export const num = (value, digits = 0) => {
  const fixed = Number(value).toFixed(digits)
  const [int, frac] = fixed.split('.')
  const spaced = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return frac ? `${spaced},${frac}` : spaced
}

/** 1400 г → 1,4 кг */
export const grams = (g) => (g >= 1000 ? `${num(g / 1000, 1)} кг` : `${num(g)} г`)

/** 39 → «39 мин», 95 → «1 сағ 35 мин» */
export const duration = (minutes, lang = 'kk') => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hourWord = lang === 'kk' ? 'сағ' : 'ч'
  const minWord = lang === 'kk' ? 'мин' : 'мин'
  return h ? `${h} ${hourWord} ${m} ${minWord}` : `${m} ${minWord}`
}

/** Пайыз: 2/3 → 67 */
export const percent = (value, target) => (target ? Math.min(100, Math.round((value / target) * 100)) : 0)

/** SVG жолын кері айналдыру: «Қайдан/Қайда» ауысқанда бағыт та ауысады */
export const reversePath = (d) => {
  const pairs = [...d.matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g)].map((m) => [m[1], m[2]])
  if (pairs.length < 2) return d
  const reversed = pairs.reverse()
  return reversed.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
}
