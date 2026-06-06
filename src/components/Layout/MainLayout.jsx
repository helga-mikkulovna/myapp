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
import './MainLayout.css'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const BRAND_TEXT = 'Пульс Арктики'

const AuroraIcon = ({ size = 32 }) => (
  <svg viewBox="-5 -3 165 102" height={size} width={size * (200 / 175)} aria-label="Aurora borealis" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {[
        ['al1','#1a6abf'],['al2','#1970b7'],['al3','#1876af'],
        ['al4','#16829f'],['al5','#158897'],['al6','#148e8f'],
        ['al7','#129487'],['al8','#119a7e'],['al9','#10a076'],
        ['al10','#0fa570'],['al11','#0faa68'],['al12','#0faa68'],
      ].map(([id, color]) => (
        <linearGradient key={id} id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0.92" />
        </linearGradient>
      ))}
    </defs>
    <rect fill="url(#al1)"  height="77" rx="4.5" transform="rotate(-4,   4.5, 92)" width="9" x="0"   y="15" />
    <rect fill="url(#al2)"  height="80" rx="4.5" transform="rotate(-3,  17.5, 91)" width="9" x="13"  y="11" />
    <rect fill="url(#al3)"  height="81" rx="4.5" transform="rotate(-2,  30.5, 89)" width="9" x="26"  y="8"  />
    <rect fill="url(#al4)"  height="82" rx="4.5" transform="rotate(-1,  43.5, 89)" width="9" x="39"  y="7"  />
    <rect fill="url(#al5)"  height="81" rx="4.5" transform="rotate( 0,  56.5, 89)" width="9" x="52"  y="8"  />
    <rect fill="url(#al6)"  height="80" rx="4.5" transform="rotate( 1,  69.5, 91)" width="9" x="65"  y="11" />
    <rect fill="url(#al7)"  height="77" rx="4.5" transform="rotate( 2,  82.5, 92)" width="9" x="78"  y="15" />
    <rect fill="url(#al8)"  height="75" rx="4.5" transform="rotate( 3,  95.5, 94)" width="9" x="91"  y="19" />
    <rect fill="url(#al9)"  height="73" rx="4.5" transform="rotate( 4,108.5, 95)" width="9" x="104" y="22" />
    <rect fill="url(#al10)" height="72" rx="4.5" transform="rotate( 5,121.5, 95)" width="9" x="117" y="23" />
    <rect fill="url(#al11)" height="73" rx="4.5" transform="rotate( 4,134.5, 95)" width="9" x="130" y="22" />
    <rect fill="url(#al12)" height="75" rx="4.5" transform="rotate( 3,147.5, 94)" width="9" x="143" y="19" />
  </svg>
)

const COLORS = {
  textDarkBlue: '#0A2B4E',
  pillBg: 'rgba(247, 247, 247, 0.9)',
  pillBorder: 'rgba(200, 204, 209, 0.65)',
  pillShadow: '0 8px 24px rgba(0, 144, 255, 0.08)',
  hoverBg: 'rgba(160, 200, 255, 0.55)',
}

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
              background: location.pathname === item.key ? COLORS.hoverBg : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: COLORS.textDarkBlue,
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
    <Layout style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--ruwiki-blue) 0, rgba(160, 200, 255, -1) 270px, var(--ruwiki-gray-light) 100px)',
    }}>
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
          width: 'calc(100% - 40px)',
          maxWidth: 1120,
          margin: '0 auto',
          background: COLORS.pillBg,
          backdropFilter: 'blur(12px)',
          borderRadius: 50,
          padding: isMobile ? '8px 16px' : '10px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: COLORS.pillShadow,
          border: `1px solid ${COLORS.pillBorder}`,
        }}>
          {/* Логотип */}
          <Link to="/" style={{ color: COLORS.textDarkBlue, fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AuroraIcon size={isMobile ? 26 : 40} />
              {BRAND_TEXT}
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
                    color: location.pathname === item.key ? COLORS.textDarkBlue : COLORS.textDarkBlue,
                    fontSize: 14,
                    fontWeight: location.pathname === item.key ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: '8px 0',
                    borderBottom: location.pathname === item.key ? `2px solid ${COLORS.textDarkBlue}` : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => { e.target.style.background = COLORS.hoverBg }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
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
                className="main-layout-search"
                placeholder="Поиск..."
                style={{ width: 180 }}
                onSearch={(value) => console.log('search:', value)}
              />
            ) : (
              <SearchOutlined 
                style={{ fontSize: 18, color: COLORS.textDarkBlue, cursor: 'pointer' }} 
                onClick={() => setSearchModalOpen(true)}
              />
            )}

            {/* Переключатель языка — просто кнопка RU/EN */}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'white',
                border: `1px solid ${COLORS.pillBorder}`,
                borderRadius: 30,
                padding: isMobile ? '5px 14px' : '6px 18px',
                color: COLORS.textDarkBlue,
                fontSize: isMobile ? 13 : 14,
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => { e.target.style.background = COLORS.hoverBg }}
              onMouseLeave={(e) => { e.target.style.background = 'white' }}
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
                      background: COLORS.textDarkBlue,
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
                style={{ fontSize: 18, color: COLORS.textDarkBlue, cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </Header>

      <Content className={`main-layout-content${isMobile ? ' is-mobile' : ''}`}>
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