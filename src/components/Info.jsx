import { createContext, useContext } from 'react'
import Icon from './Icons.jsx'

// Детальдар экранда көрсетілмейді — «?» басылғанда төменнен шығатын парақта ашылады.
const SheetContext = createContext(() => {})

export const SheetProvider = SheetContext.Provider
export const useSheet = () => useContext(SheetContext)

/**
 * Кішкентай «?» батырмасы. Басылғанда sheet ашылады.
 * title — парақ тақырыбы, children — мазмұны (мәтін немесе тізім).
 */
export function InfoButton({ title, children, label = '?' }) {
  const openSheet = useSheet()
  return (
    <button
      type="button"
      className="info-btn"
      aria-label={typeof title === 'string' ? title : 'info'}
      onClick={(e) => {
        e.stopPropagation()
        openSheet({ title, body: children })
      }}
    >
      {label}
    </button>
  )
}

/** Парақ (bottom sheet) — телефон қаңқасының ішінде ашылады */
export default function Sheet({ data, onClose, closeLabel }) {
  if (!data) return null
  return (
    <div className="sheet-overlay" role="presentation" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <span className="sheet__grip" />
        <header className="sheet__head">
          <h3>{data.title}</h3>
          <button type="button" className="sheet__close" onClick={onClose} aria-label={closeLabel}>
            <Icon name="close" size={16} stroke={2.2} />
          </button>
        </header>
        <div className="sheet__body">{data.body}</div>
      </div>
    </div>
  )
}
