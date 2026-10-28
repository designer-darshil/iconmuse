import { useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../../utils/cn'

type Theme = 'light' | 'dark'

interface AnimatedThemeTogglerProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  className?: string
}

/** Magic UI inspired circle-reveal theme switcher (explicit Light/Dark only). */
export function AnimatedThemeToggler({ theme, onThemeChange, className }: AnimatedThemeTogglerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const busyRef = useRef(false)
  const toggleTheme = useCallback(() => {
    if (busyRef.current) return
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const applyTheme = () => {
      root.classList.toggle('dark', nextTheme === 'dark')
      root.style.colorScheme = nextTheme
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', nextTheme === 'dark' ? '#111318' : '#ffffff')
      flushSync(() => onThemeChange(nextTheme))
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const button = buttonRef.current
    const transitionDocument = document as Document & { startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> } }
    if (!button || reduceMotion || !transitionDocument.startViewTransition) {
      applyTheme()
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const transition = transitionDocument.startViewTransition(applyTheme)
    busyRef.current = true
    transition.ready.then(() => {
      const animation = root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 420, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      )
      animation.finished.catch(() => {}).finally(() => { busyRef.current = false })
    }).catch(() => { busyRef.current = false })
    transition.finished.finally(() => { busyRef.current = false }).catch(() => {})
  }, [onThemeChange, theme])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7E7EA] bg-white text-[#0F1116] transition-colors hover:bg-[#F7F7F8] focus-visible:outline-none', className)}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
    </button>
  )
}
