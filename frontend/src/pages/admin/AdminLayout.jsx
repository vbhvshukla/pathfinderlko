import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/authSlice'
import { Home, Calendar, FileText, Image, BookOpen, Mail } from 'lucide-react'

export default function AdminLayout() {
  const user = useSelector(selectCurrentUser)
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent/10'}`

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r border-border p-4 text-left">
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

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
