import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      // Проверка токена (можно заменить на запрос к API)
      setUser({ role: 'admin', name: 'Администратор' })
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Тут должен быть запрос к Directus /auth/login
    if (username === 'admin' && password === 'arctic2026') {
      const userData = { role: 'admin', name: 'Администратор' }
      localStorage.setItem('admin_token', 'fake-jwt-token')
      setUser(userData)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}