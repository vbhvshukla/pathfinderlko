import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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

// PWA Service Worker: registered automatically by vite-plugin-pwa (see vite.config.js).
// Handles its own update lifecycle via registerType: 'autoUpdate'.
