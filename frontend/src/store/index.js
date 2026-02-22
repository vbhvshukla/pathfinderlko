import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout as logoutThunk } from './authSlice'
import { setupInterceptors } from '@/lib/api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
})

// setup axios interceptors with store.dispatch and the logout thunk
setupInterceptors(store.dispatch, logoutThunk)

export default store
