import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, Info, Briefcase, FileText, Mail, Calendar, LogIn } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout as logoutAction, selectCurrentUser } from '@/store/authSlice'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reduxUser = useSelector(selectCurrentUser)
  const { pathname } = location
  const isActive = (path) => pathname === path

  useEffect(() => {
    setUser(reduxUser)
  }, [reduxUser])

  async function handleLogout() {
    await dispatch(logoutAction())
    navigate('/')
  }

  return (
    <header className="w-full bg-background/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-bold text-primary">
              Pathfinder
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
           
            <Link to="/" className={`text-sm flex items-center gap-2 ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Home className="w-4 h-4"/>Home</Link>
            <Link to="/about" className={`text-sm flex items-center gap-2 ${isActive('/about') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Info className="w-4 h-4"/>About</Link>
            <Link to="/services" className={`text-sm flex items-center gap-2 ${isActive('/services') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Briefcase className="w-4 h-4"/>Services</Link>
            <Link to="/blog" className={`text-sm flex items-center gap-2 ${isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><FileText className="w-4 h-4"/>Blog</Link>
            <Link to="/contact" className={`text-sm flex items-center gap-2 ${isActive('/contact') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}><Mail className="w-4 h-4"/>Contact</Link>
            <Button variant="default" size="sm" asChild>
              <Link to="/appointments" className="flex items-center gap-2"><Calendar className="w-4 h-4"/>Book Now</Link>
            </Button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Button variant="ghost" asChild>
                  <Link to="/auth" className="flex items-center gap-2"><LogIn className="w-4 h-4"/>Sign in</Link>
                </Button>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-accent/10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/90 border-t border-border">
          <div className="px-4 py-3 space-y-2">
            {pathname !== '/' && (
              <Link to="/" className={`block flex items-center gap-2 ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground'}`}><Home className="w-4 h-4"/>Home</Link>
            )}
            <Link to="/about" className={`block flex items-center gap-2 ${isActive('/about') ? 'text-primary font-semibold' : 'text-foreground'}`}><Info className="w-4 h-4"/>About</Link>
            <Link to="/services" className={`block flex items-center gap-2 ${isActive('/services') ? 'text-primary font-semibold' : 'text-foreground'}`}><Briefcase className="w-4 h-4"/>Services</Link>
            <Link to="/blog" className={`block flex items-center gap-2 ${isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground'}`}><FileText className="w-4 h-4"/>Blog</Link>
            <Link to="/contact" className={`block flex items-center gap-2 ${isActive('/contact') ? 'text-primary font-semibold' : 'text-foreground'}`}><Mail className="w-4 h-4"/>Contact</Link>
            <Link to="/appointments" className={`block flex items-center gap-2 ${isActive('/appointments') ? 'text-primary font-semibold' : 'text-foreground'}`}><Calendar className="w-4 h-4"/>Book Now</Link>
            {user ? (
              <button onClick={handleLogout} className="block text-left w-full flex items-center gap-2"><LogIn className="w-4 h-4"/>Sign out</button>
            ) : (
              <Link to="/auth" className="block flex items-center gap-2"><LogIn className="w-4 h-4"/>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
