import { L, MODES, PLACES, ROUTES } from '../data.js'
import { co2Of } from '../lib/calc.js'
import Icon from './Icons.jsx'
import { InfoButton } from './Info.jsx'
import SchematicMap from './SchematicMap.jsx'
import RouteCard from './RouteCard.jsx'

const FILTERS = [
  { id: 'all', label: { kk: 'Барлығы', ru: 'Все' }, test: () => true },
  { id: 'active', label: { kk: 'Белсенді', ru: 'Активные' }, test: (m) => ['walk', 'bike', 'escooter'].includes(m) },
  { id: 'public', label: { kk: 'Қоғамдық', ru: 'Общественный' }, test: (m) => ['bus', 'trolley', 'metro'].includes(m) },
  { id: 'auto', label: { kk: 'Авто', ru: 'Авто' }, test: (m) => ['car', 'taxi', 'ev'].includes(m) },
]

const SORTS = [
  { id: 'time', key: 'sort.time', pick: (r) => r.minutes },
  { id: 'co2', key: 'sort.co2', pick: (r, rates) => co2Of(r, rates) },
  { id: 'cost', key: 'sort.cost', pick: (r) => r.cost },
]

// Карта белгілерінің түсіндірмесі — «?» парағында
const LEGEND = ['walk', 'bike', 'escooter', 'bus', 'trolley', 'metro', 'ev', 'car', 'taxi']

export default function RouteScreen({
  lang,
  t,
  rates,
  selectedId,
  onSelect,
  compareIds,
  onToggleCompare,
  sort,
  setSort,
  filter,
  setFilter,
  swapped,
  setSwapped,
}) {
  const from = swapped ? PLACES[1] : PLACES[0]
  const to = swapped ? PLACES[0] : PLACES[1]
  const activeFilter = FILTERS.find((f) => f.id === filter) ?? FILTERS[0]
  const visible = ROUTES.filter((r) => activeFilter.test(r.mode))
  const sorter = SORTS.find((s) => s.id === sort) ?? SORTS[0]
  const sorted = [...visible].sort((a, b) => sorter.pick(a, rates) - sorter.pick(b, rates))

  return (
    <div className="screen-body">
      {/* Іздеу карточкасы */}
      <section className="search-card">
        <div className="search-card__fields">
          <span className="search-card__dots">
            <i className="dot dot--a" />
            <i className="dot-line" />
            <i className="dot dot--b" />
          </span>
          <div className="search-card__places">
            <div className="place">
              <span className="place__label">{t('search.from')}</span>
              <span className="place__name">{L(from.name, lang)}</span>
            </div>
            <div className="place">
              <span className="place__label">{t('search.to')}</span>
              <span className="place__name">{L(to.name, lang)}</span>
            </div>
          </div>
          <button type="button" className="swap-btn" title={t('search.swap')} onClick={() => setSwapped(!swapped)}>
            <Icon name="swap" size={18} />
          </button>
        </div>
        <div className="search-card__foot">
          <span className="chip chip--soft">
            <Icon name="clock" size={15} /> {t('search.now')} · 18:40
          </span>
          <button type="button" className="btn btn--primary">
            {t('search.plan')}
          </button>
        </div>
      </section>

      {/* Көлік түрлері бойынша сүзгі */}
      <div className="filter-row">
        <span className="filter-row__label">{t('filter.label')}</span>
        <div className="chips">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip${filter === f.id ? ' is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {L(f.label, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Схемалық карта */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('map.title')}</h2>
          <InfoButton title={t('info.mapTitle')}>
            <ul className="sheet-list">
              <li>
                <span className="sheet-dot sheet-dot--start" />
                {t('info.mapStart')}
              </li>
              <li>
                <span className="sheet-dot sheet-dot--finish" />
                {t('info.mapFinish')}
              </li>
              <li>
                <span className="sheet-dot sheet-dot--line" />
                {t('info.mapLine')}
              </li>
              <li>
                <span className="sheet-dot sheet-dot--dash" />
                {t('info.mapDash')}
              </li>
              <li>
                <span className="sheet-dot sheet-dot--stop" />
                {t('info.mapStop')}
              </li>
            </ul>
            <div className="sheet-legend">
              {LEGEND.map((id) => (
                <span className="sheet-legend__item" key={id}>
                  <i style={{ background: MODES[id].color }} />
                  {L(MODES[id].short, lang)}
                </span>
              ))}
            </div>
          </InfoButton>
        </header>
        <SchematicMap
          lang={lang}
          routes={visible}
          selectedId={selectedId}
          onSelect={onSelect}
          rates={rates}
          swapped={swapped}
        />
      </section>

      {/* Нұсқалар тізімі */}
      <section className="panel">
        <header className="panel__head">
          <h2>
            {t('results.title')} <span className="panel__count">{visible.length}</span>
          </h2>
          <div className="segmented">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`segmented__item${sort === s.id ? ' is-active' : ''}`}
                onClick={() => setSort(s.id)}
              >
                {t(s.key)}
              </button>
            ))}
          </div>
        </header>

        <div className="route-list">
          {sorted.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              lang={lang}
              t={t}
              rates={rates}
              selected={route.id === selectedId}
              inCompare={compareIds.includes(route.id)}
              onSelect={onSelect}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
