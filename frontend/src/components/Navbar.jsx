import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Info, Briefcase, FileText, Mail, Calendar, LogIn, LayoutDashboard, HeartPulse, Globe, Image as ImageIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout as logoutAction, selectCurrentUser } from '@/store/authSlice'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduxUser = useSelector(selectCurrentUser)
  const { pathname } = location
  const isActive = (path) => pathname === path
  const isAdmin = user && (user.role === 'admin' || user.isAdmin || (Array.isArray(user.roles) && user.roles.includes('admin')))
  // AdminLayout renders its own mobile header/drawer, and the public MobileTabBar
  // covers navigation everywhere else, so this bar only needs to render on desktop
  // widths while on an /admin route (it still shows fully on mobile elsewhere).
  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    setUser(reduxUser)
  }, [reduxUser])

  async function handleLogout() {
    await dispatch(logoutAction())
    navigate('/')
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(nextLang)
  }

  return (
    <header className={`w-full bg-background/70 backdrop-blur sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] ${isAdminRoute ? 'hidden md:block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary">
              Pathfinder
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link to="/admin" className={`text-sm flex items-center gap-2 ${isActive('/admin') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><LayoutDashboard className="w-4 h-4"/>{t('nav_dashboard')}</Link>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Hi {user.name}!</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>{t('nav_signout')}</Button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Link to="/" className={`text-sm flex items-center gap-2 ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Home className="w-4 h-4"/>{t('nav_home')}</Link>
                <Link to="/about" className={`text-sm flex items-center gap-2 ${isActive('/about') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Info className="w-4 h-4"/>{t('nav_about')}</Link>
                <Link to="/services" className={`text-sm flex items-center gap-2 ${isActive('/services') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Briefcase className="w-4 h-4"/>{t('nav_services')}</Link>
                <Link to="/blog" className={`text-sm flex items-center gap-2 ${isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><FileText className="w-4 h-4"/>{t('nav_blog')}</Link>
                <Link to="/events" className={`text-sm flex items-center gap-2 ${isActive('/events') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Calendar className="w-4 h-4"/>{t('nav_events')}</Link>
                <Link to="/gallery" className={`text-sm flex items-center gap-2 ${isActive('/gallery') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><ImageIcon className="w-4 h-4"/>{t('nav_gallery') || 'Gallery'}</Link>
                <Link to="/quiz" className={`text-sm flex items-center gap-2 ${isActive('/quiz') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><HeartPulse className="w-4 h-4"/>{t('nav_quiz')}</Link>
                <Link to="/contact" className={`text-sm flex items-center gap-2 ${isActive('/contact') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Mail className="w-4 h-4"/>{t('nav_contact')}</Link>
                {user && (
                  <Link to="/my-appointments" className={`text-sm flex items-center gap-2 ${isActive('/my-appointments') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Calendar className="w-4 h-4"/>{t('nav_my_appointments')}</Link>
                )}
                <Button variant="default" size="sm" asChild>
                  <Link to="/appointments" className="flex items-center gap-2"><Calendar className="w-4 h-4"/>{t('nav_book')}</Link>
                </Button>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Hi {user.name}!</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>{t('nav_signout')}</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth" className="flex items-center gap-2"><LogIn className="w-4 h-4"/>{t('nav_signin')}</Link>
                  </Button>
                )}
              </>
            )}

            {/* Language Switcher */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full border-primary/20 text-primary hover:bg-primary/5"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4" />
            </Button>
          </nav>

          {/* Mobile: logo only here — primary nav lives in the bottom tab bar's "More" sheet */}
          <div className="md:hidden flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="text-sm flex items-center gap-2 text-foreground"><LayoutDashboard className="w-4 h-4"/></Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
