import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/** Re-triggers enter animation when the route path changes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div
      key={pathname}
      className={visible ? 'page-enter' : 'page-enter page-enter--reset'}
    >
      {children}
    </div>
  )
}
