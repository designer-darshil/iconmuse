import { useState, useEffect } from 'react'
import type { DeviceBreakpoint } from '../types'

export function useBreakpoint(): {
  breakpoint: DeviceBreakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
} {
  const [breakpoint, setBreakpoint] = useState<DeviceBreakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1280) return 'tablet'
    return 'desktop'
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1280) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  }
}
