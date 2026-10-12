import { L, PERSONAL } from '../data.js'
import { num, percent } from '../lib/calc.js'
import Icon from './Icons.jsx'
import { InfoButton } from './Info.jsx'

// Жеке мақсаттар: күнделікті шек, апта динамикасы, серия, жетістіктер
export default function GoalsScreen({ lang, t, goals, onBumpGoal }) {
  const weekMax = Math.max(...PERSONAL.week.map((d) => d.value))
  const usedPercent = percent(PERSONAL.usedToday, PERSONAL.dayLimit)

  return (
    <div className="screen-body">
      {/* Негізгі көрсеткіш */}
      <section className="hero">
        <div className="hero__grid">
          <div className="ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="ring__track" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="ring__value"
                strokeDasharray={`${(PERSONAL.weekProgress / 100) * 264} 264`}
              />
            </svg>
            <div className="ring__center">
              <b>{PERSONAL.weekProgress}%</b>
              <span>{t('goals.week')}</span>
            </div>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span>{t('goals.savedToday')}</span>
              <b>
                {num(PERSONAL.savedToday, 1)} <small>{t('unit.kgco2')}</small>
              </b>
            </div>
            <div className="hero__stat">
              <span>{t('goals.streak')}</span>
              <b>
                {PERSONAL.streak} <small>{t('goals.days')}</small>
              </b>
            </div>
          </div>
        </div>

        <div className="limit">
          <div className="limit__head">
            <span className="limit__title">
              {t('goals.dayLimit')}
              <InfoButton title={t('info.limitTitle')}>
                <p className="sheet-formula">{t('compare.formula1')}</p>
                <div className="sheet-rows">
                  <div className="sheet-row">
                    <span>{t('goals.dayLimit')}</span>
                    <b>
                      {num(PERSONAL.dayLimit, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('goals.used')}</span>
                    <b>
                      {num(PERSONAL.usedToday, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('goals.savedToday')}</span>
                    <b>
                      {num(PERSONAL.savedToday, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('goals.week')}</span>
                    <b>
                      {num(PERSONAL.savedWeek, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('goals.streak')}</span>
                    <b>
                      {PERSONAL.streak} {t('goals.days')}
                    </b>
                  </div>
                </div>
                <p className="sheet-note">{t('compare.disclaimer')}</p>
              </InfoButton>
            </span>
            <b>
              {num(PERSONAL.usedToday, 1)} / {num(PERSONAL.dayLimit, 1)} {t('unit.kgco2')}
            </b>
          </div>
          <div className="progress">
            <span className="progress__fill" style={{ width: `${usedPercent}%` }} />
          </div>
          <div className="limit__foot">
            <span>{t('goals.used')}</span>
            <span className="limit__saved">
              −{num(PERSONAL.savedToday, 1)} {t('unit.kgco2')} · {t('card.vsCar')}
            </span>
          </div>
        </div>
      </section>

      {/* Апта күндері */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('goals.week')}</h2>
          <span className="panel__hint">
            {num(PERSONAL.savedWeek, 1)} {t('unit.kgco2')}
          </span>
        </header>
        <div className="week">
          {PERSONAL.week.map((d, i) => (
            <div className="week__col" key={i}>
              <span className="week__bar-wrap">
                <span className="week__bar" style={{ height: `${(d.value / weekMax) * 100}%` }} />
              </span>
              <span className="week__day">{L(d.day, lang)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Менің мақсаттарым */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('goals.myGoals')}</h2>
        </header>
        <div className="goal-list">
          {goals.map((g) => {
            const p = percent(g.value, g.target)
            const done = g.value >= g.target
            return (
              <div className={`goal${done ? ' is-done' : ''}`} key={g.id}>
                <span className="goal__icon">
                  <Icon name={g.icon} size={18} />
                </span>
                <div className="goal__body">
                  <div className="goal__head">
                    <b>{L(g.title, lang)}</b>
                    <span>
                      {num(g.value)} / {num(g.target)} {L(g.unit, lang)}
                    </span>
                  </div>
                  <div className="progress progress--thin">
                    <span className="progress__fill" style={{ width: `${p}%` }} />
                  </div>
                </div>
                <button type="button" className="goal__btn" onClick={() => onBumpGoal(g.id)}>
                  <Icon name={done ? 'check' : 'plus'} size={15} stroke={2.4} />
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Жетістіктер */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('goals.achievements')}</h2>
          <span className="panel__hint">
            {PERSONAL.achievements.filter((a) => a.unlocked).length}/{PERSONAL.achievements.length}
          </span>
        </header>
        <div className="badges">
          {PERSONAL.achievements.map((a) => (
            <div className={`badge${a.unlocked ? ' is-unlocked' : ''}`} key={a.id}>
              <span className="badge__icon" style={{ '--badge-color': a.color }}>
                <Icon name={a.icon} size={20} />
              </span>
              <b>{L(a.title, lang)}</b>
              <small>{L(a.desc, lang)}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
