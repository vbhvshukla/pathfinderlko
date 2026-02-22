import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, selectCurrentUser } from '@/store/authSlice'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AuthLoader({ children }) {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const status = useSelector(s => s.auth && s.auth.status)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (status === 'loading') return
    if (!user) return
    const isAdmin = user && (user.role === 'admin' || user.isAdmin || (Array.isArray(user.roles) && user.roles.includes('admin')))
    const path = location.pathname || '/'
    if (isAdmin && !path.startsWith('/admin')) {
      navigate('/admin', { replace: true })
    }
  }, [user, status, location.pathname, navigate])

  return <>{children}</>
}
