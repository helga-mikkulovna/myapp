import { useState, useEffect } from 'react'
import { Layout, Input, Drawer, Avatar, Dropdown, Space, Typography } from 'antd'
import { 
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const MainLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('RU')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Пункты меню (наши заголовки)
  const navItems = [
    { key: '/', label: 'Главная' },
    { key: '/catalog', label: 'Каталог' },
    { key: '/digests', label: 'Дайджесты' },
    { key: '/sources', label: 'Источники' },
  ]

  // Админские пункты
  const adminNavItems = user ? [
    { key: '/admin', label: 'Админка' },
    { key: '/admin/sources', label: 'Управление источниками' },
  ] : []

  const allNavItems = [...navItems, ...adminNavItems]

  // Переключение языка (просто кнопка)
  const toggleLanguage = () => {
    const newLang = currentLang === 'RU' ? 'EN' : 'RU'
    setCurrentLang(newLang)
    // Здесь можно добавить логику смены языка в i18n
  }

  const handleNavClick = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  // Меню человечка для админа
  const adminMenuItems = [
    {
      key: 'info',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong style={{ display: 'block' }}>{user?.name || 'Администратор'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{user?.email || 'admin@arctic-portal.ru'}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Роль: Администратор</Text>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'admin_panel',
      icon: <SettingOutlined />,
      label: 'Админ-панель',
      onClick: () => navigate('/admin'),
    },
    {
      key: 'sources_manage',
      icon: <DatabaseOutlined />,
      label: 'Управление источниками',
      onClick: () => navigate('/admin/sources'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: logout,
      danger: true,
    },
  ]

  // Мобильное меню
  const MobileMenu = () => (
    <Drawer
      title="Меню"
      placement="left"
      onClose={() => setMobileMenuOpen(false)}
      open={mobileMenuOpen}
      bodyStyle={{ padding: 0 }}
      width={280}
    >
      <div style={{ padding: '16px' }}>
        {allNavItems.map(item => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item.key)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              background: location.pathname === item.key ? '#E6F4FF' : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: location.pathname === item.key ? '#00A8A8' : '#333',
              fontWeight: location.pathname === item.key ? 'bold' : 'normal',
              cursor: 'pointer',
              marginBottom: 4,
              fontSize: 15
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </Drawer>
  )

  // Мобильный поиск
  const MobileSearch = () => (
    <Drawer
      title="Поиск"
      placement="top"
      onClose={() => setSearchModalOpen(false)}
      open={searchModalOpen}
      height="auto"
    >
      <Input.Search
        placeholder="Поиск новостей..."
        size="large"
        autoFocus
        onSearch={(value) => {
          console.log('search:', value)
          setSearchModalOpen(false)
        }}
      />
    </Drawer>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Шапка — полупрозрачная, овальная */}
      <Header style={{
        background: 'transparent',
        position: 'sticky',
        top: 20,
        zIndex: 1000,
        height: 'auto',
        padding: 0,
        lineHeight: 'normal',
      }}>
        <div style={{
          maxWidth: 'calc(100% - 40px)',
          margin: '0 auto',
          background: 'rgba(10, 43, 78, 0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: 50,
          padding: isMobile ? '8px 16px' : '10px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          {/* Логотип */}
          <Link to="/" style={{ color: 'white', fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold' }}>
            {isMobile ? '🗺️' : '🗺️ Арктический портал'}
          </Link>

          {/* Десктопное меню */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 28, marginLeft: 40 }}>
              {allNavItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: location.pathname === item.key ? '#00A8A8' : 'white',
                    fontSize: 14,
                    fontWeight: location.pathname === item.key ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: '8px 0',
                    borderBottom: location.pathname === item.key ? '2px solid #00A8A8' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#00A8A8'}
                  onMouseLeave={(e) => e.target.style.color = location.pathname === item.key ? '#00A8A8' : 'white'}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Правая панель */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
            {/* Поиск */}
            {!isMobile ? (
              <Input.Search
                placeholder="Поиск..."
                style={{ width: 180, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 30 }}
                suffix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />}
                onSearch={(value) => console.log('search:', value)}
              />
            ) : (
              <SearchOutlined 
                style={{ fontSize: 18, color: 'white', cursor: 'pointer' }} 
                onClick={() => setSearchModalOpen(true)}
              />
            )}

            {/* Переключатель языка — просто кнопка RU/EN */}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: 30,
                padding: isMobile ? '5px 14px' : '6px 18px',
                color: 'white',
                fontSize: isMobile ? 13 : 14,
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            >
              {currentLang}
            </button>

            {/* Человечек для админа с выпадающим меню */}
            {user && (
              <Dropdown 
                menu={{ items: adminMenuItems }} 
                placement="bottomRight"
                trigger={['click']}
              >
                <div style={{ cursor: 'pointer' }}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      background: '#00A8A8', 
                      cursor: 'pointer',
                      width: isMobile ? 28 : 32,
                      height: isMobile ? 28 : 32
                    }}
                  />
                </div>
              </Dropdown>
            )}

            {/* Бургер для мобильных */}
            {isMobile && (
              <MenuOutlined 
                style={{ fontSize: 18, color: 'white', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </Header>

      <Content style={{ 
        padding: isMobile ? '16px' : '32px', 
        background: '#f5f7fa', 
        minHeight: 'calc(100vh - 60px)',
        marginTop: isMobile ? 16 : 32
      }}>
        {children}
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        background: '#0A2B4E', 
        color: 'rgba(255,255,255,0.7)',
        padding: isMobile ? '16px' : '24px',
        fontSize: isMobile ? '12px' : '14px'
      }}>
        © 2026 Арктический информационно-аналитический портал
      </Footer>

      <MobileMenu />
      <MobileSearch />
    </Layout>
  )
}

export default MainLayout