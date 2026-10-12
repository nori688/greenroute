import { L, MODES, RATE_TABLE, ROUTES } from '../data.js'
import { co2Of, grams, num, savedVsCar } from '../lib/calc.js'
import Icon from './Icons.jsx'
import { InfoButton } from './Info.jsx'

export default function CompareScreen({ lang, t, rates, setRate, resetRates, compareIds, onToggleCompare, goRoutes }) {
  const picked = ROUTES.filter((r) => compareIds.includes(r.id))
  const maxCo2 = Math.max(1, ...picked.map((r) => co2Of(r, rates)))
  const maxMinutes = Math.max(1, ...picked.map((r) => r.minutes))
  const totalSaved = picked.reduce((sum, r) => sum + savedVsCar(r, rates), 0)

  return (
    <div className="screen-body">
      <section className="panel">
        <header className="panel__head">
          <h2>{t('compare.title')}</h2>
          <span className="panel__hint">{t('compare.pick')}</span>
        </header>

        {picked.length === 0 ? (
          <div className="empty">
            <Icon name="compare" size={30} />
            <p>{t('compare.empty')}</p>
            <button type="button" className="btn btn--primary" onClick={goRoutes}>
              {t('tab.route')}
            </button>
          </div>
        ) : (
          <>
            <div className="picked-chips">
              {picked.map((r) => (
                <button key={r.id} type="button" className="picked-chip" onClick={() => onToggleCompare(r.id)}>
                  <span className="picked-chip__dot" style={{ background: MODES[r.mode].color }} />
                  {L(MODES[r.mode].short, lang)}
                  <Icon name="minus" size={13} stroke={2.4} />
                </button>
              ))}
            </div>

            <div className="chart">
              <div className="chart__head">
                <span>{t('compare.chart')}</span>
                <span className="chart__scale">
                  0 — {num(maxCo2)} {t('unit.gco2')}
                </span>
              </div>
              {picked.map((r) => {
                const mode = MODES[r.mode]
                const co2 = co2Of(r, rates)
                return (
                  <div className="bar-row" key={r.id}>
                    <span className="bar-row__label">{L(mode.short, lang)}</span>
                    <span className="bar-track">
                      <span className="bar" style={{ width: `${Math.max(2, (co2 / maxCo2) * 100)}%`, background: mode.color }} />
                    </span>
                    <span className="bar-row__value">{num(co2)}</span>
                  </div>
                )
              })}
            </div>

            <div className="chart chart--time">
              <div className="chart__head">
                <span>{t('compare.time')}</span>
                <span className="chart__scale">
                  {num(maxMinutes)} {t('unit.min')}
                </span>
              </div>
              {picked.map((r) => (
                <div className="bar-row" key={r.id}>
                  <span className="bar-row__label">{L(MODES[r.mode].short, lang)}</span>
                  <span className="bar-track">
                    <span className="bar bar--time" style={{ width: `${Math.max(2, (r.minutes / maxMinutes) * 100)}%` }} />
                  </span>
                  <span className="bar-row__value">{r.minutes}</span>
                </div>
              ))}
            </div>

            <div className="saved-box">
              <Icon name="leaf" size={26} />
              <div>
                <span>{t('compare.totalSaved')}</span>
                <b>
                  {num(totalSaved / 1000, 1)} {t('unit.kgco2')}
                </b>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Ашық коэффициенттер — есептің барлық детальдары «?» ішінде */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('compare.coefTitle')}</h2>
          <span className="panel__head-right">
            <InfoButton title={t('info.formulaTitle')}>
              <p className="sheet-formula">{t('compare.formula1')}</p>
              <p className="sheet-formula">{t('compare.formula2')}</p>
              {picked.length > 0 && (
                <div className="sheet-rows">
                  <div className="sheet-row">
                    <span>{L(picked[0].title, lang)}</span>
                    <b>
                      {num(picked[0].distance, 1)} {t('unit.km')} × {num(rates[picked[0].mode])} ={' '}
                      {grams(co2Of(picked[0], rates))}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('card.saved')}</span>
                    <b>
                      {num(picked[0].distance, 1)} × ({num(rates.car)} − {num(rates[picked[0].mode])}) ={' '}
                      {grams(savedVsCar(picked[0], rates))}
                    </b>
                  </div>
                </div>
              )}
              <p className="sheet-note">{t('compare.disclaimer')}</p>
              <p className="sheet-note">
                {t('compare.sourcesTitle')}: EEA (2023), IEA / ҚР электр желісінің шартты коэффициенті.
              </p>
            </InfoButton>
          </span>
        </header>

        <div className="coef-table">
          {RATE_TABLE.map((id) => {
            const mode = MODES[id]
            const used = picked.find((r) => r.mode === id)
            return (
              <div className="coef-row" key={id}>
                <span className="coef-row__mode">
                  <span className="coef-row__dot" style={{ background: mode.color }}>
                    <Icon name={mode.icon} size={14} stroke={2} />
                  </span>
                  <b>{L(mode.label, lang)}</b>
                </span>
                <span className="coef-row__input">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="900"
                    step="1"
                    value={rates[id]}
                    onChange={(e) => setRate(id, e.target.value)}
                  />
                  <small>г/{t('unit.km')}</small>
                </span>
                <InfoButton title={L(mode.label, lang)}>
                  <p className="sheet-formula">
                    1 {t('unit.km')} × {num(rates[id])} г/{t('unit.km')} = {num(rates[id])} г CO₂
                  </p>
                  {used && (
                    <div className="sheet-rows">
                      <div className="sheet-row">
                        <span>{L(used.title, lang)}</span>
                        <b>{grams(co2Of(used, rates))}</b>
                      </div>
                    </div>
                  )}
                  <p className="sheet-note">{L(mode.source, lang)}</p>
                </InfoButton>
              </div>
            )
          })}
        </div>

        <button type="button" className="btn btn--ghost coef-reset" onClick={resetRates}>
          <Icon name="swap" size={15} /> {t('compare.reset')}
        </button>
      </section>
    </div>
  )
}
