import { useCallback, useState } from 'react'
import { ToastContext, type Toast, type ToastVariant } from './ToastContext'

const DEFAULT_DURATION_MS = 3000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), DEFAULT_DURATION_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}