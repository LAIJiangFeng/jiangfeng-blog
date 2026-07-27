import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { MusicProvider } from './components/music/MusicProvider'
import { PageLoader } from './components/ui/PageLoader'
import { routerBasename } from './lib/asset'
import { initTheme } from './lib/theme'
import './styles/index.css'

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename()}>
      <ThemeProvider>
        <MusicProvider>
          <PageLoader />
          <App />
        </MusicProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
