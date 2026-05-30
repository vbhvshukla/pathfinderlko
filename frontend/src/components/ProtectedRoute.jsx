import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '@/store/authSlice'
import Loader from './ui/loader'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const user = useSelector(selectCurrentUser)
  const authStatus = useSelector((state) => state.auth.status)
  const location = useLocation()

  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader size={48} className="text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to auth page, preserving the route they wanted to hit
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requireAdmin) {
    const isAdmin = user.role === 'admin' || user.isAdmin
    if (!isAdmin) {
      // Not admin? Redirect to home
      return <Navigate to="/" replace />
    }
  }

  return children
}
