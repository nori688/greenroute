import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_RATES, L, PERSONAL, TEAM, TEAM_BASE_KG } from './data.js'
import { LANG_LABEL, LANGS, makeT } from './i18n.js'
import Icon from './components/Icons.jsx'
import Sheet, { SheetProvider } from './components/Info.jsx'
import RouteScreen from './components/RouteScreen.jsx'
import CompareScreen from './components/CompareScreen.jsx'
import GoalsScreen from './components/GoalsScreen.jsx'
import TeamScreen from './components/TeamScreen.jsx'

const TABS = [
  { id: 'route', key: 'tab.route', icon: 'route' },
  { id: 'compare', key: 'tab.compare', icon: 'compare' },
  { id: 'goals', key: 'tab.goals', icon: 'target' },
  { id: 'team', key: 'tab.team', icon: 'users' },
]

const MAX_COMPARE = 4

export default function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const [lang, setLang] = useState(() => (LANGS.includes(params.get('lang')) ? params.get('lang') : 'kk'))
  const [tab, setTab] = useState(() => {
    const value = params.get('tab')
    return TABS.some((x) => x.id === value) ? value : 'route'
  })
  // Тақырып: index.html ішіндегі шағын скрипт бірден қояды (жыпылықтамау үшін)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'light')
  const [sheet, setSheet] = useState(null)

  const [rates, setRates] = useState(DEFAULT_RATES)
  const [selectedId, setSelectedId] = useState('bike-boulevard')
  const [compareIds, setCompareIds] = useState(['walk-park', 'bike-boulevard', 'bus-84'])
  const [sort, setSort] = useState('time')
  const [filter, setFilter] = useState('all')
  const [swapped, setSwapped] = useState(false)
  const [goals, setGoals] = useState(PERSONAL.goals)
  const [tasks, setTasks] = useState(TEAM.tasks)

  const t = useMemo(() => makeT(lang), [lang])
  const mainRef = useRef(null)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1310' : '#0b3d2c')
    try {
      localStorage.setItem('gr-theme', theme)
    } catch {
      /* жеке режимде сақтауға рұқсат болмауы мүмкін — маңызды емес */
    }
  }, [theme])

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
    setSheet(null)
  }, [tab])

  const totalKg = useMemo(
    () => TEAM_BASE_KG + tasks.filter((x) => x.done).reduce((sum, x) => sum + x.rewardKg, 0),
    [tasks],
  )

  const setRate = (id, value) => {
    const parsed = Number(value)
    setRates((prev) => ({ ...prev, [id]: Number.isFinite(parsed) ? Math.min(900, Math.max(0, parsed)) : 0 }))
  }

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      const next = [...prev, id]
      return next.length > MAX_COMPARE ? next.slice(next.length - MAX_COMPARE) : next
    })
  }

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))

  const bumpGoal = (id) =>
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, value: Math.min(g.target, g.value + Math.max(1, Math.round(g.target / 10))) } : g,
      ),
    )

  const screen = () => {
    switch (tab) {
      case 'compare':
        return (
          <CompareScreen
            lang={lang}
            t={t}
            rates={rates}
            setRate={setRate}
            resetRates={() => setRates(DEFAULT_RATES)}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            goRoutes={() => setTab('route')}
          />
        )
      case 'goals':
        return <GoalsScreen lang={lang} t={t} goals={goals} onBumpGoal={bumpGoal} />
      case 'team':
        return <TeamScreen lang={lang} t={t} tasks={tasks} totalKg={totalKg} onToggleTask={toggleTask} />
      default:
        return (
          <RouteScreen
            lang={lang}
            t={t}
            rates={rates}
            selectedId={selectedId}
            onSelect={setSelectedId}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            sort={sort}
            setSort={setSort}
            filter={filter}
            setFilter={setFilter}
            swapped={swapped}
            setSwapped={setSwapped}
          />
        )
    }
  }

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />

      <div className="phone">
        <SheetProvider value={setSheet}>
          <header className="app-header">
            <div className="brand">
              <span className="brand__mark">
                <Icon name="leaf" size={19} />
              </span>
              <span className="brand__text">
                <b>GreenRoute</b>
                <small>{t('app.tagline')}</small>
              </span>
            </div>

            <div className="header-tools">
              <div className="lang-switch" role="group" aria-label="Тіл / Язык">
                {LANGS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={code === lang ? 'is-active' : ''}
                    onClick={() => setLang(code)}
                  >
                    {LANG_LABEL[code]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="theme-btn"
                aria-label={t('theme.toggle')}
                title={t('theme.toggle')}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
              </button>
            </div>
          </header>

          <main className="app-main" ref={mainRef}>
            {screen()}
          </main>

          <nav className="tabbar">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tabbar__item${tab === item.id ? ' is-active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                <span className="tabbar__icon">
                  <Icon name={item.icon} size={21} />
                  {item.id === 'compare' && compareIds.length > 0 && (
                    <span className="tabbar__badge">{compareIds.length}</span>
                  )}
                </span>
                {t(item.key)}
              </button>
            ))}
          </nav>

          <Sheet data={sheet} onClose={() => setSheet(null)} closeLabel={t('info.close')} />
        </SheetProvider>
      </div>

      <p className="app__caption">
        GreenRoute · {t('proto.badge')} · React + Vite ·{' '}
        {L({ kk: 'интернетсіз схемалық карта', ru: 'схематичная карта без интернета' }, lang)}
      </p>
    </div>
  )
}
