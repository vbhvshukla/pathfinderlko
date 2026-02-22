import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch, getMe, logout as apiLogout } from '@/lib/api'

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const user = await getMe()
  return user
})

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  const data = await apiFetch('/auth/login', { method: 'POST', data: credentials })
  return data.user
})

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  const data = await apiFetch('/auth/register', { method: 'POST', data: payload })
  return data.user
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiLogout()
  } catch (err) {}
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.status = 'loading' })
      .addCase(fetchMe.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(fetchMe.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })

      .addCase(login.pending, (state) => { state.status = 'loading' })
      .addCase(login.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })

      .addCase(register.pending, (state) => { state.status = 'loading' })
      .addCase(register.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })

      .addCase(logout.fulfilled, (state) => { state.user = null })
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => !!state.auth.user
