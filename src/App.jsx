import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/Layout/MainLayout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import DigestsPage from './pages/DigestsPage'
import DigestViewPage from './pages/DigestViewPage'  // Добавить импорт
import SourcesPage from './pages/SourcesPage'
import AdminSourcesPage from './pages/AdminSourcesPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import NewsViewPage from './pages/NewsViewPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичные страницы */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/catalog" element={<MainLayout><CatalogPage /></MainLayout>} />
          <Route path="/digests" element={<MainLayout><DigestsPage /></MainLayout>} />
          <Route path="/news/:id" element={<MainLayout><NewsViewPage /></MainLayout>} />
          <Route path="/digests/:type/:id" element={<MainLayout><DigestViewPage /></MainLayout>} />  {/* Новый маршрут */}
          <Route path="/sources" element={<MainLayout><SourcesPage /></MainLayout>} />
          
          {/* Страница входа */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Защищённые админ-страницы */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <MainLayout><AdminPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sources" element={
            <ProtectedRoute>
              <MainLayout><AdminSourcesPage /></MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App