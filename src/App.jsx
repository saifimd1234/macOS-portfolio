import React from 'react'
import { Navbar, Welcome, Dock, Desktop, MobileView } from '#components'
import WindowManager from '#windows'
import { WindowsProvider } from '#store'
import { ThemeProvider } from '#store/theme'
import useIsMobile from '#hooks/useIsMobile'

const App = () => {
  const isMobile = useIsMobile()

  return (
    <ThemeProvider>
      {isMobile ? (
        <MobileView />
      ) : (
        <WindowsProvider>
          <main>
            <Navbar />
            <Welcome />
            <Desktop />
            <WindowManager />
            <Dock />
          </main>
        </WindowsProvider>
      )}
    </ThemeProvider>
  )
}

export default App
