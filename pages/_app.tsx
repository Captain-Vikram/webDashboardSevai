import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/streak-fire-element.css'
import { useEffect, useState } from 'react'
import { getThemeByStreak, applyTheme, type Theme } from '../lib/theme-generator'
import Head from 'next/head'

interface DashboardData {
  account?: {
    currentStreak?: number;
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Force dark theme class
    document.documentElement.classList.add('dark')
    
    // Load dashboard data to get current streak
    fetch('/dashboard-data.json')
      .then(res => res.json())
      .then((data: DashboardData) => {
        const streakDays = data.account?.currentStreak || 0;
        
        // Get theme based on streak days (aligned with flame colors)
        const theme = getThemeByStreak(streakDays)
        applyTheme(theme)
        setCurrentTheme(theme)
        
        console.log(`🔥 Streak: ${streakDays} days → Theme: ${theme.name}`)
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err)
        // Fallback to 0 streak (Graphite theme) if data can't be loaded
        const theme = getThemeByStreak(0)
        applyTheme(theme)
        setCurrentTheme(theme)
      })
    
    // Mark font as ready to load
    setFontLoaded(true)
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  // Generate Google Fonts URL for the selected font
  const getFontUrl = () => {
    if (!currentTheme) return null
    
    const fontName = currentTheme.fontName
    
    // Special handling for non-Google fonts
    if (fontName === 'Geist Sans' || fontName === 'JetBrains Mono') {
      // These fonts might not be on Google Fonts
      // Geist Sans can be loaded from Vercel CDN, JetBrains Mono from Google Fonts
      if (fontName === 'JetBrains Mono') {
        return `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap`
      }
      // For Geist Sans, use system fallback
      return null
    }
    
    const fontFamily = fontName.replace(/ /g, '+')
    const weights = [300, 400, 500, 600, 700, 800].join(';')
    
    return `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights}&display=swap`
  }

  return (
    <>
      <Head>
        {fontLoaded && currentTheme && (
          <>
            <link
              rel="preconnect"
              href="https://fonts.googleapis.com"
            />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
            />
            <link
              href={getFontUrl() || ''}
              rel="stylesheet"
            />
          </>
        )}
      </Head>
      <div className="dark">
        <Component {...pageProps} />
      </div>
    </>
  )
}
