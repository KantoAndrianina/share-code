import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans <ToastProvider>')

  return {
    success: (msg: string) => ctx.show(msg, 'success'),
    error:   (msg: string) => ctx.show(msg, 'error'),
    info:    (msg: string) => ctx.show(msg, 'info'),
  }
}