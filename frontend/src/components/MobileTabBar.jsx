import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Home,
  Briefcase,
  Calendar,
  FileText,
  Menu,
  Info,
  Image as ImageIcon,
  HeartPulse,
  Mail,
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { logout as logoutAction, selectCurrentUser } from '@/store/authSlice'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

// Fixed bottom tab bar shown on small screens only, giving the site a native-app
// navigation feel. Hidden on /admin routes, which have their own sidebar/layout.
export default function MobileTabBar() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const [moreOpen, setMoreOpen] = useState(false)

  if (pathname.startsWith('/admin')) return null

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  async function handleLogout() {
    setMoreOpen(false)
    await dispatch(logoutAction())
    navigate('/')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')
  }

  const tabClass = (active) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full text-[11px] font-medium transition-colors active:scale-95 ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`

  const moreLinks = [
    { to: '/about', label: t('nav_about'), icon: Info },
    { to: '/events', label: t('nav_events'), icon: Calendar },
    { to: '/gallery', label: t('nav_gallery') || 'Gallery', icon: ImageIcon },
    { to: '/quiz', label: t('nav_quiz'), icon: HeartPulse },
    { to: '/contact', label: t('nav_contact'), icon: Mail },
    ...(user ? [{ to: '/my-appointments', label: t('nav_my_appointments'), icon: Calendar }] : []),
    ...(user && (user.role === 'admin' || user.isAdmin)
      ? [{ to: '/admin', label: t('nav_dashboard'), icon: LayoutDashboard }]
      : []),
  ]

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-14 max-w-md mx-auto px-1">
          <Link to="/" className={tabClass(isActive('/'))}>
            <Home className="w-5 h-5" />
            {t('nav_home')}
          </Link>
          <Link to="/services" className={tabClass(isActive('/services'))}>
            <Briefcase className="w-5 h-5" />
            {t('nav_services')}
          </Link>

          {/* Raised primary CTA */}
          <div className="flex-1 flex items-center justify-center relative">
            <Link
              to="/appointments"
              aria-label={t('nav_book')}
              className="absolute -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-90 transition-transform"
            >
              <Calendar className="w-6 h-6" />
            </Link>
            <span className="text-[11px] font-medium text-muted-foreground mt-6">{t('nav_book')}</span>
          </div>

          <Link to="/blog" className={tabClass(isActive('/blog'))}>
            <FileText className="w-5 h-5" />
            {t('nav_blog')}
          </Link>

          <button onClick={() => setMoreOpen(true)} className={tabClass(moreOpen)}>
            <Menu className="w-5 h-5" />
            More
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(env(safe-area-inset-bottom)+1rem)] max-h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-0">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 px-4">
            {moreLinks.map((link) => {
              const Icon = link.icon
              return (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-xs font-medium text-center active:scale-95 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    {link.label}
                  </Link>
                </SheetClose>
              )
            })}
            <button
              onClick={toggleLanguage}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-xs font-medium text-center active:scale-95 transition-transform"
            >
              <Globe className="w-5 h-5 text-primary" />
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
          <div className="px-4 pt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 text-destructive p-3 text-sm font-medium active:scale-95 transition-transform"
              >
                <LogOut className="w-4 h-4" /> {t('nav_signout')}
              </button>
            ) : (
              <SheetClose asChild>
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground p-3 text-sm font-medium active:scale-95 transition-transform"
                >
                  <LogIn className="w-4 h-4" /> {t('nav_signin')}
                </Link>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
