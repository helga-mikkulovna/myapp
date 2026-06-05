import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title } = Typography

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onFinish = async (values) => {
    setLoading(true)
    const success = login(values.username, values.password)
    if (success) {
      message.success('Вход выполнен успешно')
      navigate('/admin')
    } else {
      message.error('Неверные логин или пароль')
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: isMobile ? 16 : 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ 
        width: isMobile ? '100%' : 400, 
        borderRadius: 16, 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        margin: isMobile ? 16 : 0
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: isMobile ? 40 : 48 }}>🗺️</div>
          <Title level={isMobile ? 4 : 3}>Вход в админ-панель</Title>
          <Alert 
            message="Демо-доступ: admin / arctic2026"
            type="info" 
            showIcon 
            style={{ marginTop: 16 }}
          />
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input 
              prefix={<UserOutlined />} 
              size={isMobile ? 'middle' : 'large'} 
              placeholder="Логин" 
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password 
              prefix={<LockOutlined />} 
              size={isMobile ? 'middle' : 'large'} 
              placeholder="Пароль" 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size={isMobile ? 'middle' : 'large'} 
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage