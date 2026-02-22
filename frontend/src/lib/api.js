import axios from 'axios'

let base = import.meta.env.VITE_API_URL || ''
// strip trailing /api if user included it in env to avoid duplicate /api in requests
if (base && base.endsWith('/api')) base = base.replace(/\/api$/, '')
const client = axios.create({
  baseURL: base || '',
  withCredentials: true,
})

export default client

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('/api') ? path : `/api${path}`
  const method = (options.method || 'GET').toLowerCase()
  try {
    const data = options.body || options.data
    // if sending FormData, do NOT include a headers object so axios/browser sets the multipart boundary
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData

    const reqConfig = {
      url,
      method,
      data,
      params: options.params,
    }
    if (!isForm) {
      reqConfig.headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
    } else {
      // explicitly set Content-Type undefined so axios/browser set the multipart boundary
      reqConfig.headers = { ...(options.headers || {}), 'Content-Type': undefined }
    }

    const res = await client.request(reqConfig)
    return res.data
  } catch (err) {
    const e = err
    const message = e.response?.data?.message || e.message || 'Request failed'
    const error = new Error(message)
    error.status = e.response?.status
    error.payload = e.response?.data
    throw error
  }
}

export async function getMe() {
  try {
    const res = await client.get('/api/auth/me')
    return res.data?.user || null
  } catch (err) {
    return null
  }
}

export async function logout() {
  try {
    await client.post('/api/auth/logout')
  } catch (err) {
    // ignore
  }
}

// Axios response interceptor: on 401, clear auth in store
export function setupInterceptors(dispatch, logoutAction) {
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status
      if (status === 401) {
        try {
          dispatch(logoutAction())
        } catch (e) {
          // ignore
        }
      }
      return Promise.reject(err)
    }
  )
}
