import { useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Button, Progress, Space, Typography, message, Badge, Tooltip } from 'antd'
import { 
  RiseOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ReloadOutlined,
  WarningOutlined,
  DollarOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

const AdminPage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    newsToday: 47,
    newsGrowth: 12,
    activeSources: 23,
    inactiveSources: 3,
    tokensUsed: 12450,
    tokensLimit: 50000,
  })

  const [errors, setErrors] = useState([
    { id: 1, source: 'ТАСС', date: '2026-06-05 14:32', error: 'Timeout при запросе RSS', resolved: false },
    { id: 2, source: 'North News', date: '2026-06-05 10:15', error: 'SSL сертификат истёк', resolved: false },
    { id: 3, source: 'Арктический совет', date: '2026-06-04 23:45', error: 'Изменение структуры API', resolved: true },
  ])

  const [sourceStatus, setSourceStatus] = useState([
    { name: 'ТАСС', status: 'ok', lastUpdate: '2 мин назад', items: 124 },
    { name: 'РИА Новости', status: 'ok', lastUpdate: '5 мин назад', items: 98 },
    { name: 'Коммерсантъ', status: 'ok', lastUpdate: '15 мин назад', items: 76 },
    { name: 'Интерфакс', status: 'warning', lastUpdate: '45 мин назад', items: 52 },
    { name: 'North News', status: 'error', lastUpdate: '3 часа назад', items: 0 },
  ])

  const refreshData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Данные обновлены')
    } catch (error) {
      message.error('Ошибка при обновлении')
    } finally {
      setLoading(false)
    }
  }

  const checkAllSources = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      message.success('Проверка источников завершена')
    } catch (error) {
      message.error('Ошибка при проверке')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { 
      title: 'Источник', 
      dataIndex: 'source', 
      key: 'source',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Дата ошибки', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => <Text><ClockCircleOutlined style={{ marginRight: 4 }} /> {date}</Text>
    },
    { 
      title: 'Ошибка', 
      dataIndex: 'error', 
      key: 'error',
      ellipsis: true
    },
    { 
      title: 'Статус', 
      dataIndex: 'resolved', 
      key: 'resolved', 
      render: (resolved) => (
        <Tag color={resolved ? 'green' : 'red'} icon={resolved ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {resolved ? 'Решена' : 'Активна'}
        </Tag>
      )
    },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ok': return <CheckCircleOutlined style={{ color: '#2E8B57' }} />
      case 'warning': return <WarningOutlined style={{ color: '#E67E22' }} />
      case 'error': return <CloseCircleOutlined style={{ color: '#E53E3E' }} />
      default: return <CloseCircleOutlined style={{ color: '#888' }} />
    }
  }

  const getStatusTag = (status) => {
    switch(status) {
      case 'ok': return <Tag color="success">Работает</Tag>
      case 'warning': return <Tag color="warning">Задержка</Tag>
      case 'error': return <Tag color="error">Ошибка</Tag>
      default: return <Tag>Неизвестно</Tag>
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={2} style={{ color: '#0A2B4E', margin: 0 }}>
          🛡️ Админ-панель
        </Title>
        <Space wrap>
          <Button 
            icon={<ReloadOutlined spin={loading} />} 
            onClick={refreshData}
            loading={loading}
          >
            Обновить всё
          </Button>
          <Button 
            icon={<DatabaseOutlined />} 
            onClick={() => navigate('/admin/sources')}
            type="primary"
            ghost
          >
            Управление источниками
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, height: '100%' }}>
            <Statistic 
              title="Новостей за сегодня" 
              value={stats.newsToday} 
              prefix={<RiseOutlined />}
              styles={{ content: { color: '#2E8B57' } }}
              suffix={<span style={{ fontSize: 14, color: '#2E8B57' }}>+{stats.newsGrowth}%</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, height: '100%' }}>
            <Statistic 
              title="Активные источники" 
              value={stats.activeSources} 
              suffix={`/ ${stats.activeSources + stats.inactiveSources}`}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#4A90E2' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, height: '100%' }}>
            <Statistic 
              title="Неактивные источники" 
              value={stats.inactiveSources} 
              prefix={<CloseCircleOutlined />}
              styles={{ content: { color: '#E53E3E' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text type="secondary">Затрачено токенов</Text>
              <Tooltip title="Обновить данные о токенах">
                <Button icon={<ReloadOutlined />} size="small" onClick={refreshData} />
              </Tooltip>
            </div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              {stats.tokensUsed.toLocaleString()} / {stats.tokensLimit.toLocaleString()}
            </div>
            <Progress 
              percent={Math.round((stats.tokensUsed / stats.tokensLimit) * 100)} 
              size="small" 
              status={stats.tokensUsed / stats.tokensLimit > 0.8 ? 'exception' : 'active'} 
              strokeColor={stats.tokensUsed / stats.tokensLimit > 0.8 ? '#E53E3E' : '#4A90E2'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <ApiOutlined />
                <span>📡 Доступность RSS-лент</span>
              </Space>
            }
            extra={
              <Button size="small" icon={<ReloadOutlined />} onClick={checkAllSources} loading={loading}>
                Проверить всё
              </Button>
            }
            style={{ borderRadius: 12, height: '100%' }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ minHeight: 320 }}>
              {sourceStatus.map((src, idx) => (
                <div key={idx} style={{ 
                  marginBottom: 12, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx !== sourceStatus.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <Space size="middle">
                    {getStatusIcon(src.status)}
                    <Text strong style={{ minWidth: 120 }}>{src.name}</Text>
                    {getStatusTag(src.status)}
                  </Space>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {src.lastUpdate}
                    </Text>
                    <Badge count={src.items} showZero color={src.items > 0 ? '#52c41a' : '#ff4d4f'} />
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            title={
              <Space>
                <WarningOutlined />
                <span>⚠️ Ошибки парсинга</span>
              </Space>
            }
            extra={
              <Badge count={errors.filter(e => !e.resolved).length} color="red" />
            }
            style={{ borderRadius: 12, height: '100%' }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ minHeight: 320 }}>
              {errors.length > 0 ? (
                <Table 
                  columns={columns} 
                  dataSource={errors} 
                  rowKey="id" 
                  pagination={false}
                  size="small"
                  scroll={{ y: 280 }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <CheckCircleOutlined style={{ fontSize: 48, color: '#2E8B57' }} />
                  <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                    Нет ошибок парсинга
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <DollarOutlined />
                <span>💰 Использование API</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 40px' }}>
              <Progress 
                type="circle" 
                percent={Math.round((stats.tokensUsed / stats.tokensLimit) * 100)} 
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>{percent}%</div>
                    <div style={{ fontSize: 12, color: '#888' }}>использовано</div>
                  </div>
                )}
                strokeColor={stats.tokensUsed / stats.tokensLimit > 0.8 ? '#E53E3E' : '#4A90E2'}
                width={180}
              />
              <div style={{ marginTop: 24 }}>
                <Space size="large" wrap>
                  <div>
                    <Text type="secondary">Использовано</Text>
                    <div><Text strong style={{ fontSize: 20 }}>{stats.tokensUsed.toLocaleString()}</Text> токенов</div>
                  </div>
                  <div>
                    <Text type="secondary">Осталось</Text>
                    <div><Text strong style={{ fontSize: 20, color: '#2E8B57' }}>{(stats.tokensLimit - stats.tokensUsed).toLocaleString()}</Text> токенов</div>
                  </div>
                  <div>
                    <Text type="secondary">Лимит</Text>
                    <div><Text strong style={{ fontSize: 20 }}>{stats.tokensLimit.toLocaleString()}</Text> токенов</div>
                  </div>
                </Space>
              </div>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" size="large" icon={<DollarOutlined />}>
                  Пополнить токены
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminPage