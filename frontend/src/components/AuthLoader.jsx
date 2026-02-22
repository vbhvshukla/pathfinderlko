import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, selectCurrentUser } from '@/store/authSlice'

export default function AuthLoader({ children }) {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return <>{children}</>
}
