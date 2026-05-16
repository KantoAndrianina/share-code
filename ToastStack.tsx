import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'
import s from './ToastStack.module.css'

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
        <div
          key={toast.id}
          className={`${s.toast} ${s[toast.variant]}`}
          role="status"
          onClick={() => ctx.dismiss(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}