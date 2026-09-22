import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout as logoutAction, selectCurrentUser } from '@/store/authSlice'
import { Home, Calendar, FileText, Image, BookOpen, Mail, Menu, Briefcase, Users, LogOut, MessageSquareHeart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

const NAV_ITEMS = [
  { to: '/admin', end: true, label: 'Dashboard', icon: Home },
  { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { to: '/admin/events', label: 'Events & RSVPs', icon: Calendar },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/images', label: 'Images', icon: Image },
  { to: '/admin/magazines', label: 'Magazines', icon: BookOpen },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/contacts', label: 'Contact Messages', icon: Mail },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareHeart },
]

// Bottom tab bar shows the sections an admin checks daily; everything else
// (content/config pages used less often) lives behind the "More" sheet.
const TAB_ITEMS = [
  { to: '/admin', end: true, label: 'Home', icon: Home },
  { to: '/admin/appointments', label: 'Appts', icon: Calendar },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail },
]
const MORE_ITEMS = NAV_ITEMS.filter((item) => !TAB_ITEMS.some((t) => t.to === item.to))

function getInitials(name) {
  if (!name) return 'A'
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase()
}

export default function AdminLayout() {
  const [moreOpen, setMoreOpen] = useState(false)
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent/10'}`

  const isActivePath = (item) => (item.end ? pathname === item.to : pathname.startsWith(item.to))
  const currentLabel = NAV_ITEMS.find(isActivePath)?.label || 'Admin'
  const moreActive = MORE_ITEMS.some(isActivePath)

  const tabClass = (active) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-medium transition-colors active:scale-95 ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`
  const iconPillClass = (active) =>
    `flex items-center justify-center w-10 h-6 rounded-full transition-colors ${active ? 'bg-primary/10' : ''}`

  async function handleLogout() {
    setMoreOpen(false)
    await dispatch(logoutAction())
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border p-4 text-left flex-col">
        <div className="text-xl font-bold mb-6 text-left">Welcome Back!</div>
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="inline-block mr-2 w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-destructive hover:bg-destructive/10 mt-4 border-t border-border pt-4"
        >
          <LogOut className="w-5 h-5" /> Sign out{user?.name ? ` (${user.name})` : ''}
        </button>
      </aside>

      {/* mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-none">Admin</div>
            <div className="text-lg font-bold leading-tight mt-0.5">{currentLabel}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>

      {/* mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch h-14 max-w-md mx-auto px-1">
          {TAB_ITEMS.map((item) => {
            const active = isActivePath(item)
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={tabClass(active)}>
                <span className={iconPillClass(active)}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                </span>
                {item.label}
              </NavLink>
            )
          })}
          <button onClick={() => setMoreOpen(true)} className={tabClass(moreActive || moreOpen)}>
            <span className={iconPillClass(moreActive || moreOpen)}>
              <Menu className="w-5 h-5" strokeWidth={moreActive || moreOpen ? 2.4 : 2} />
            </span>
            More
          </button>
        </div>
      </nav>

      {/* "More" sheet: remaining nav sections + sign out */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(env(safe-area-inset-bottom)+1rem)] max-h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-0">
            <SheetTitle>Admin Menu</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 px-4">
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActivePath(item)
              return (
                <SheetClose asChild key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-medium text-center active:scale-95 transition-transform ${
                      active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </SheetClose>
              )
            })}
          </div>
          <div className="px-4 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 text-destructive p-3 text-sm font-medium active:scale-95 transition-transform"
            >
              <LogOut className="w-4 h-4" /> Sign out{user?.name ? ` (${user.name})` : ''}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-4 pt-20 md:p-6 md:pt-6 pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] md:pb-6 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
