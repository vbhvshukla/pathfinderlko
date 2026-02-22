import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/authSlice'
import { Home, Calendar, FileText, Image, BookOpen, Mail, Menu } from 'lucide-react'

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const user = useSelector(selectCurrentUser)
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent/10'}`

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* desktop sidebar */}
      <aside className="hidden md:block w-64 border-r border-border p-4 text-left">
        <div className="text-xl font-bold mb-6 text-left">Welcome Back!</div>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}><Home className="inline-block mr-2 w-5 h-5"/>Dashboard</NavLink>
          <NavLink to="/admin/appointments" className={linkClass}><Calendar className="inline-block mr-2 w-5 h-5"/>Appointments</NavLink>
          <NavLink to="/admin/blogs" className={linkClass}><FileText className="inline-block mr-2 w-5 h-5"/>Blogs</NavLink>
          <NavLink to="/admin/images" className={linkClass}><Image className="inline-block mr-2 w-5 h-5"/>Images</NavLink>
          <NavLink to="/admin/magazines" className={linkClass}><BookOpen className="inline-block mr-2 w-5 h-5"/>Magazines</NavLink>
          <NavLink to="/admin/contacts" className={linkClass}><Mail className="inline-block mr-2 w-5 h-5"/>Contact Messages</NavLink>
        </nav>
      </aside>

      {/* mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-bold">Admin</div>
          <button onClick={() => setOpen(o => !o)} aria-label="Toggle admin menu" className="p-2 rounded hover:bg-accent/10">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* mobile sidebar drawer */}
      {open && (
        <aside className="md:hidden fixed inset-0 z-50 bg-background p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold">Welcome Back!</div>
            <button onClick={() => setOpen(false)} className="px-2 py-1">Close</button>
          </div>
          <nav className="space-y-1">
            <NavLink to="/admin" end className={linkClass} onClick={() => setOpen(false)}><Home className="inline-block mr-2 w-5 h-5"/>Dashboard</NavLink>
            <NavLink to="/admin/appointments" className={linkClass} onClick={() => setOpen(false)}><Calendar className="inline-block mr-2 w-5 h-5"/>Appointments</NavLink>
            <NavLink to="/admin/blogs" className={linkClass} onClick={() => setOpen(false)}><FileText className="inline-block mr-2 w-5 h-5"/>Blogs</NavLink>
            <NavLink to="/admin/images" className={linkClass} onClick={() => setOpen(false)}><Image className="inline-block mr-2 w-5 h-5"/>Images</NavLink>
            <NavLink to="/admin/magazines" className={linkClass} onClick={() => setOpen(false)}><BookOpen className="inline-block mr-2 w-5 h-5"/>Magazines</NavLink>
            <NavLink to="/admin/contacts" className={linkClass} onClick={() => setOpen(false)}><Mail className="inline-block mr-2 w-5 h-5"/>Contact Messages</NavLink>
          </nav>
        </aside>
      )}

      <main className={`flex-1 p-6 ${open ? 'pt-20' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}
