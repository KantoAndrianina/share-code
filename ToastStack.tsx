import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'
import s from './ToastStack.module.css'

const TITLE_BY_VARIANT = {
  success: 'Succès',
  error:   'Erreur',
  info:    'Info',
}

const ICON_BY_VARIANT = {
  success: '✓',
  error:   '!',
  info:    'i',
}

export default function ToastStack() {
  const ctx = useContext(ToastContext)
  if (!ctx) return null

  return (
    <div
      className={s.stack}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {ctx.toasts.map(toast => (
        <div key={toast.id} className={`${s.toast} ${s[toast.variant]}`} role="status">
          <div className={s.icon} aria-hidden="true">
            {ICON_BY_VARIANT[toast.variant]}
          </div>

          <div className={s.body}>
            <div className={s.title}>{TITLE_BY_VARIANT[toast.variant]}</div>
            <div className={s.message}>{toast.message}</div>
          </div>

          <button
            className={s.close}
            onClick={() => ctx.dismiss(toast.id)}
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}