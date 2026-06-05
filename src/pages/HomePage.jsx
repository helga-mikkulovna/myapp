import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Tag, Space, Button, Skeleton, Divider, Typography, Spin } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, ArrowRightOutlined, RiseOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { directusApi } from '../api/directusClient'

const { Title, Text, Paragraph } = Typography

const HomePage = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Загрузка новостей за последние 24 часа
  const { data: news, isLoading } = useQuery({
    queryKey: ['top-news'],
    queryFn: async () => {
      try {
        // Получаем дату 24 часа назад
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateFrom = yesterday.toISOString().split('T')[0]
        
        const { data } = await directusApi.get('/news', {
          params: {
            sort: '-date',
            limit: 7,
            filter: { date: { _gte: dateFrom } },
            fields: 'id,title,description,date,source,category,image_url',
          },
        })
        return data.data
      } catch (error) {
        // Демо-данные
        return [
          { id: 1, title: 'Новая арктическая экспедиция стартовала из Мурманска', description: 'Учёные отправляются исследовать изменения климата в регионе. В экспедиции примут участие 45 исследователей из России, Китая и Индии.', date: '2026-06-05', source: 'ТАСС', category: 'Наука', image_url: null },
          { id: 2, title: 'Россия и Китай укрепляют сотрудничество в Арктике', description: 'Подписано соглашение о развитии Северного морского пути и совместных научных проектах в области изучения вечной мерзлоты.', date: '2026-06-05', source: 'РИА Новости', category: 'Политика', image_url: null },
          { id: 3, title: 'Новые экологические стандарты для арктических регионов', description: 'Минприроды ужесточает требования к промышленным предприятиям, работающим в Арктической зоне.', date: '2026-06-04', source: 'Коммерсантъ', category: 'Экология', image_url: null },
          { id: 4, title: 'Запущен новый ледокол «Арктика-2»', description: 'На Балтийском заводе спущен на воду новый атомный ледокол, который будет обеспечивать навигацию по Северному морскому пути.', date: '2026-06-04', source: 'Интерфакс', category: 'Инфраструктура', image_url: null },
          { id: 5, title: 'Учёные зафиксировали рекордное таяние льдов', description: 'Температура в Арктике побила 100-летний максимум, что привело к ускоренному таянию ледников.', date: '2026-06-03', source: 'Наука и жизнь', category: 'Климат', image_url: null },
        ]
      }
    },
  })

  // Тренды (топ-3 темы с ростом за неделю)
  const trends = [
    { name: 'Экология', growth: 42, color: '#2E8B57' },
    { name: 'Судоходство', growth: 28, color: '#4A90E2' },
    { name: 'Международное сотрудничество', growth: 15, color: '#00A8A8' }
  ]

  // Дайджест дня (3-5 ключевых событий)
  const digestItems = [
    { id: 1, title: 'Запуск ледокола "Арктика-2"', description: 'Новый атомный ледокол спущен на воду на Балтийском заводе. Это третье судно проекта 22220.' },
    { id: 2, title: 'Международный арктический форум', description: 'В Санкт-Петербурге завершился форум с участием 15 стран. Подписано 12 соглашений.' },
    { id: 3, title: 'Климатические рекорды', description: 'Температура в Арктике побила 100-летний максимум, зафиксировано рекордное таяние льдов.' },
    { id: 4, title: 'Новый маршрут Севморпути', description: 'Разработан альтернативный маршрут Северного морского пути, сокращающий время доставки грузов.' }
  ]

  const goToNews = (id) => navigate(`/news/${id}`)
  const goToCatalog = () => navigate('/catalog')
  const goToDigest = () => navigate('/digests')

  return (
    <div>
      <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
        {/* Лента новостей */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <Title level={isMobile ? 4 : 3} style={{ color: '#0A2B4E', margin: 0 }}>
              🧊 Последние новости
            </Title>
            {!isMobile && (
              <Button type="link" onClick={goToCatalog} style={{ color: '#4A90E2' }}>
                Все новости →
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
              {news?.slice(0, isMobile ? 5 : 7).map((item) => (
                <Card 
                  key={item.id} 
                  hoverable 
                  style={{ borderRadius: 12, cursor: 'pointer' }}
                  bodyStyle={{ padding: isMobile ? 12 : 20 }}
                  onClick={() => goToNews(item.id)}
                >
                  <Row gutter={[12, 12]}>
                    {item.image_url && !isMobile && (
                      <Col xs={24} sm={6}>
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          style={{ width: '100%', borderRadius: 8, objectFit: 'cover', height: 100 }}
                        />
                      </Col>
                    )}
                    <Col xs={24} sm={item.image_url && !isMobile ? 18 : 24}>
                      <Space wrap style={{ marginBottom: 8 }}>
                        <Tag color="#4A90E2" style={{ fontSize: isMobile ? 11 : 12 }}>
                          {item.category}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                          <CalendarOutlined /> {item.date}
                        </Text>
                        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                          <EnvironmentOutlined /> {item.source}
                        </Text>
                      </Space>
                      <Title level={isMobile ? 5 : 4} style={{ margin: '8px 0' }}>
                        {item.title}
                      </Title>
                      <Paragraph 
                        ellipsis={{ rows: isMobile ? 2 : 3 }} 
                        type="secondary"
                        style={{ fontSize: isMobile ? 12 : 14, marginBottom: 8 }}
                      >
                        {item.description}
                      </Paragraph>
                      <Button 
                        type="link" 
                        size={isMobile ? 'small' : 'middle'} 
                        style={{ paddingLeft: 0, color: '#4A90E2' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          goToNews(item.id)
                        }}
                      >
                        Читать далее <ArrowRightOutlined />
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
              {isMobile && (
                <Button block onClick={goToCatalog} style={{ marginTop: 8 }}>
                  Все новости →
                </Button>
              )}
            </div>
          )}
        </Col>

        {/* Боковая панель */}
        <Col xs={24} lg={8}>
          {/* Дайджест дня */}
          <Card 
            title={<span style={{ fontSize: isMobile ? 14 : 16 }}>📋 Дайджест дня</span>}
            style={{ 
              background: 'linear-gradient(135deg, #E6F4FF 0%, #D4F0F0 100%)',
              borderRadius: 16,
              marginBottom: 24
            }}
            bodyStyle={{ padding: isMobile ? 12 : 20 }}
          >
            {digestItems.slice(0, isMobile ? 3 : 4).map((item, idx) => (
              <div 
                key={idx} 
                style={{ marginBottom: isMobile ? 16 : 20, cursor: 'pointer' }}
                onClick={() => goToDigest()}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ 
                    width: isMobile ? 24 : 28, 
                    height: isMobile ? 24 : 28, 
                    background: '#4A90E2', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{item.title}</Text>
                    <Paragraph type="secondary" style={{ marginTop: 4, fontSize: isMobile ? 11 : 12, marginBottom: 0 }}>
                      {item.description}
                    </Paragraph>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              type="link" 
              size={isMobile ? 'small' : 'middle'} 
              style={{ paddingLeft: 0, marginTop: 8, color: '#4A90E2' }}
              onClick={goToDigest}
            >
              Все дайджесты →
            </Button>
          </Card>

          {/* Тренды Арктики */}
          <Card 
            title={<span style={{ fontSize: isMobile ? 14 : 16 }}>📈 Тренды Арктики</span>}
            style={{ borderRadius: 16 }}
            bodyStyle={{ padding: isMobile ? 12 : 20 }}
            extra={!isMobile && <Tag color="#2E8B57">+24% за неделю</Tag>}
          >
            {trends.map((trend) => (
              <div 
                key={trend.name} 
                style={{ marginBottom: isMobile ? 16 : 20, cursor: 'pointer' }}
                onClick={() => navigate(`/catalog?category=${trend.name}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{trend.name}</Text>
                  <Text style={{ color: trend.color, fontSize: isMobile ? 12 : 14 }}>
                    <RiseOutlined /> +{trend.growth}%
                  </Text>
                </div>
                {/* График — столбчатая диаграмма */}
                <div style={{ 
                  height: isMobile ? 6 : 8, 
                  background: '#E5E7EB', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${trend.growth}%`, 
                    height: '100%', 
                    background: trend.color,
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
            {isMobile && <Divider style={{ margin: '12px 0' }} />}
            <div style={{ marginTop: isMobile ? 12 : 0 }}>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                🔥 Горячие темы: климат, Севморпуть, международные соглашения
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage