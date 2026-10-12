import { L, MODES } from '../data.js'
import { co2Of, duration, grams, num, savedVsCar } from '../lib/calc.js'
import Icon from './Icons.jsx'
import { InfoButton } from './Info.jsx'

// Бағыт нұсқасының карточкасы. Экранда тек негізгі сандар,
// барлық есептеу детальдары — «?» парағында.
export default function RouteCard({ route, lang, t, rates, selected, inCompare, onSelect, onToggleCompare }) {
  const mode = MODES[route.mode]
  const co2 = co2Of(route, rates)
  const saved = savedVsCar(route, rates)
  const rate = rates[route.mode]
  const inVehicle = Math.max(0, route.minutes - route.wait)

  return (
    <article
      className={`route-card${selected ? ' is-selected' : ''}`}
      style={{ '--mode-color': mode.color }}
      onClick={() => onSelect(route.id)}
    >
      <div className="route-card__rail" />

      <div className="route-card__body">
        <div className="route-card__top">
          <span className="route-card__icon">
            <Icon name={mode.icon} size={21} />
          </span>
          <div className="route-card__title">
            <h3>{L(route.title, lang)}</h3>
            <p>
              {L(mode.label, lang)} · {num(route.distance, 1)} {t('unit.km')}
            </p>
          </div>
          <div className="route-card__time">
            <b>{route.minutes}</b>
            <span>{t('unit.min')}</span>
          </div>
        </div>

        {route.tags.length > 0 && (
          <div className="route-card__tags">
            {route.tags.includes('fastest') && <span className="tag tag--fast">{t('card.fastest')}</span>}
            {route.tags.includes('cheapest') && <span className="tag tag--cheap">{t('card.cheapest')}</span>}
            {co2 === 0 && <span className="tag tag--eco">{t('card.eco')}</span>}
          </div>
        )}

        <div className="route-card__metrics">
          <div className="metric">
            <Icon name="leaf" size={16} />
            <b>{grams(co2)}</b>
            <span>CO₂</span>
          </div>
          <div className={`metric${saved > 0 ? ' metric--good' : ''}`}>
            <Icon name="shield" size={16} />
            <b>{saved > 0 ? `−${grams(saved)}` : '0 г'}</b>
            <span>{t('card.saved')}</span>
          </div>
          <div className="metric">
            <Icon name="flame" size={16} />
            <b>{num(route.kcal)}</b>
            <span>{t('card.kcal')}</span>
          </div>
          <div className="metric">
            <Icon name="coin" size={16} />
            <b>{num(route.cost)}</b>
            <span>{t('unit.tenge')}</span>
          </div>
        </div>

        <div className="route-card__foot">
          <InfoButton title={L(route.title, lang)}>
            <div className="sheet-rows">
              <div className="sheet-row">
                <span>{t('info.routeCoef')}</span>
                <b>
                  {num(rate)} г/{t('unit.km')}
                </b>
              </div>
              <div className="sheet-row">
                <span>{t('info.routeDistance')}</span>
                <b>
                  {num(route.distance, 1)} {t('unit.km')}
                </b>
              </div>
              {route.wait > 0 && (
                <div className="sheet-row">
                  <span>{t('card.wait')}</span>
                  <b>
                    {route.wait} {t('unit.min')}
                  </b>
                </div>
              )}
              {route.stops > 0 && (
                <div className="sheet-row">
                  <span>{t('card.stops')}</span>
                  <b>{route.stops}</b>
                </div>
              )}
              <div className="sheet-row">
                <span>{t('info.routeRide')}</span>
                <b>{duration(inVehicle, lang)}</b>
              </div>
              <div className="sheet-row">
                <span>{t('card.kcal')}</span>
                <b>
                  {num(route.kcal)} {t('card.kcal')}
                </b>
              </div>
              <div className="sheet-row">
                <span>{t('compare.totalSaved')}</span>
                <b>{grams(saved)}</b>
              </div>
            </div>

            <p className="sheet-formula">
              {num(route.distance, 1)} {t('unit.km')} × {num(rate)} г/{t('unit.km')} = {grams(co2)}
            </p>
            <p className="sheet-formula sheet-formula--muted">
              {t('card.saved')}: {num(route.distance, 1)} × ({num(rates.car)} − {num(rate)}) = {grams(saved)}
            </p>
            <p className="sheet-note">{L(mode.source, lang)}</p>
          </InfoButton>

          <button
            type="button"
            className={`btn-add${inCompare ? ' is-on' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCompare(route.id)
            }}
          >
            <Icon name={inCompare ? 'check' : 'plus'} size={15} stroke={2.2} />
            {inCompare ? t('card.added') : t('card.add')}
          </button>
        </div>
      </div>
    </article>
  )
}
