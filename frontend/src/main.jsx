import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'
import './index.css'
import './i18n'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)

// Fade out the static splash (see index.html) once React has actually painted,
// instead of just after render() is called — double rAF waits for the browser
// to complete a frame so the crossfade doesn't clip the first paint.
const splash = document.getElementById('app-splash')
if (splash) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      splash.classList.add('app-splash-hidden')
      setTimeout(() => splash.remove(), 300)
    })
  })
}

// Dynamic Google Analytics 4 (GA4) Injection
const gaId = import.meta.env.VITE_GA_ID
if (gaId && typeof window !== 'undefined') {
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `
  document.head.appendChild(script2)
}

// PWA Service Worker. registerType:'autoUpdate' (vite.config.js) makes a new SW take
// over quickly in the background, but an already-open tab/home-screen app never reloads
// on its own — without this, installed users can be stuck on an old build indefinitely.
// Also poll for updates hourly: a home-screen app can stay open/backgrounded for days
// without a fresh navigation, which is normally what triggers the browser's own check.
const updateSW = registerSW({
  onNeedRefresh() {
    toast('A new version of Pathfinder is available.', {
      duration: Infinity,
      action: {
        label: 'Refresh',
        onClick: () => updateSW(true),
      },
    })
  },
  onRegisteredSW(_url, registration) {
    if (!registration) return
    setInterval(() => registration.update(), 60 * 60 * 1000)
  },
})
