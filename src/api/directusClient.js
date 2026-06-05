import axios from 'axios'

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export const directusApi = axios.create({
  baseURL: `${DIRECTUS_URL}/items`,
  timeout: 10000,
})

directusApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)