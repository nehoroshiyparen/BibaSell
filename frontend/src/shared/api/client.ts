import axios from 'axios'

export const API_BASE = 'http://localhost:7812' + 'api' 

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

api.interceptors.request.use(cfg => {
  console.log('[axios] request ->', cfg.method, cfg.url)
  return cfg
})
api.interceptors.response.use(res => {
  console.log('[axios] response <-', res.status, res.config?.url)
  return res
}, err => {
  console.error('[axios] response err', err?.message, err?.code, err?.response?.status)
  return Promise.reject(err)
})