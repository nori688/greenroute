import { useEffect, useState } from 'react'
import { L, TEAM, TEAM_BASE_KG } from '../data.js'
import { num, percent } from '../lib/calc.js'
import Icon from './Icons.jsx'
import { InfoButton } from './Info.jsx'

// Командалық экологиялық тапсырмалар: бірлескен мақсат, тапсырмалар, көшбасшылар
export default function TeamScreen({ lang, t, tasks, totalKg, onToggleTask }) {
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 1900)
    return () => clearTimeout(timer)
  }, [toast])

  const members = [...TEAM.members].sort((a, b) => b.kg - a.kg)
  const maxKg = Math.max(...members.map((m) => m.kg))
  const doneCount = tasks.filter((x) => x.done).length
  const goalPercent = percent(totalKg, TEAM.goal)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(TEAM.code)
    } catch {
      /* прототип: clipboard рұқсаты жоқ болса да интерфейс жұмысын жалғастырады */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="screen-body">
      {/* Топ карточкасы */}
      <section className="team-hero">
        <div className="team-hero__top">
          <span className="team-hero__avatar">
            <Icon name="users" size={22} />
          </span>
          <div>
            <h2>{L(TEAM.name, lang)}</h2>
            <p>
              {TEAM.members.length} {t('team.members')} · {doneCount}/{tasks.length} {t('team.done')}
            </p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm">
            {t('team.join')}
          </button>
        </div>

        <div className="team-hero__avatars">
          {members.slice(0, 6).map((m) => (
            <span key={m.id} className={`avatar${m.me ? ' is-me' : ''}`}>
              {m.avatar}
            </span>
          ))}
          <span className="avatar avatar--more">+2</span>
        </div>

        <div className="team-hero__goal">
          <div className="team-hero__goal-head">
            <span className="team-hero__goal-title">
              {t('team.goal')}
              <InfoButton title={t('info.teamTitle')}>
                <p className="sheet-formula">{t('compare.formula2')}</p>
                <div className="sheet-rows">
                  <div className="sheet-row">
                    <span>{t('team.members')}</span>
                    <b>{TEAM.members.length}</b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('team.savedTotal')}</span>
                    <b>
                      {num(TEAM_BASE_KG, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('team.tasks')}</span>
                    <b>
                      +{num(totalKg - TEAM_BASE_KG, 1)} {t('unit.kgco2')}
                    </b>
                  </div>
                  <div className="sheet-row">
                    <span>{t('team.goal')}</span>
                    <b>
                      {num(TEAM.goal)} {t('unit.kgco2')}
                    </b>
                  </div>
                </div>
                <p className="sheet-note">{t('compare.disclaimer')}</p>
              </InfoButton>
            </span>
            <b>
              {num(totalKg, 1)} / {num(TEAM.goal)} {t('unit.kgco2')}
            </b>
          </div>
          <div className="progress progress--light">
            <span className="progress__fill" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>

        <div className="invite">
          <span className="invite__label">{t('team.invite')}</span>
          <code>{TEAM.code}</code>
          <button type="button" className="invite__copy" onClick={copyCode}>
            <Icon name={copied ? 'check' : 'copy'} size={15} />
            {copied ? t('team.copy') : ''}
          </button>
        </div>
      </section>

      {/* Тапсырмалар */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('team.tasks')}</h2>
          <span className="panel__hint">
            +{num(tasks.filter((x) => !x.done).reduce((s, x) => s + x.rewardKg, 0), 1)} {t('unit.kgco2')}
          </span>
        </header>
        <div className="task-list">
          {tasks.map((task) => (
            <button
              type="button"
              className={`task${task.done ? ' is-done' : ''}`}
              key={task.id}
              onClick={() => {
                onToggleTask(task.id)
                if (!task.done) setToast(t('team.taskDone'))
              }}
            >
              <span className="task__check">
                <Icon name="check" size={15} stroke={2.6} />
              </span>
              <span className="task__body">
                <b>{L(task.title, lang)}</b>
                <small>{L(task.note, lang)}</small>
              </span>
              <span className="task__reward">
                +{num(task.rewardKg, 1)} {t('unit.kg')}
                <small>CO₂</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Көшбасшылар */}
      <section className="panel">
        <header className="panel__head">
          <h2>{t('team.leaderboard')}</h2>
          <Icon name="trophy" size={18} />
        </header>
        <div className="leaders">
          {members.map((m, i) => (
            <div className={`leader${m.me ? ' is-me' : ''}`} key={m.id}>
              <span className={`leader__rank${i < 3 ? ` rank-${i + 1}` : ''}`}>{i + 1}</span>
              <span className="avatar avatar--sm">{m.avatar}</span>
              <span className="leader__name">{L(m.name, lang)}</span>
              {m.me && <span className="leader__you">{t('team.you')}</span>}
              <span className="leader__bar">
                <span style={{ width: `${(m.kg / maxKg) * 100}%` }} />
              </span>
              <b className="leader__kg">{num(m.kg, 1)} кг</b>
            </div>
          ))}
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
