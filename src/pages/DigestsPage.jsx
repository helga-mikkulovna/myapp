import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Typography, Tabs, Button, Space, Tag, Empty, Spin, Drawer, Avatar, Tooltip, List } from 'antd'
import { CalendarOutlined, FileTextOutlined, MenuOutlined, EyeOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const DigestsPage = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [activeTab, setActiveTab] = useState('daily')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Данные дайджестов с топ-3 новостями
  const digests = {
    daily: [
      { 
        id: 1, 
        title: 'Дайджест за 5 июня 2026', 
        period: '5 июня 2026',
        date: '2026-06-05', 
        summary: 'Основные события Арктики за день: экологические инициативы, новые маршруты Севморпути, встречи глав регионов. Подписано соглашение о сотрудничестве между Россией и Китаем в области арктических исследований.', 
        count: 12,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ'],
        topNews: [
          { id: 101, title: 'Россия и Китай укрепляют сотрудничество в Арктике очень длинное название которое может не поместиться', views: 3452, category: 'Политика' },
          { id: 102, title: 'Новая арктическая экспедиция стартовала из Мурманска', views: 2891, category: 'Наука' },
          { id: 103, title: 'Новые экологические стандарты', views: 2156, category: 'Экология' },
        ]
      },
      { 
        id: 2, 
        title: 'Дайджест за 4 июня 2026', 
        period: '4 июня 2026',
        date: '2026-06-04', 
        summary: 'Международное сотрудничество, научные экспедиции, инфраструктурные проекты в Арктической зоне. Запущена новая полярная станция на Шпицбергене.', 
        count: 8,
        sources: ['ТАСС', 'Интерфакс'],
        topNews: [
          { id: 201, title: 'Запущена новая полярная станция на Шпицбергене', views: 1872, category: 'Инфраструктура' },
          { id: 202, title: 'Учёные завершили исследование вечной мерзлоты', views: 1567, category: 'Наука' },
        ]
      },
      { 
        id: 3, 
        title: 'Дайджест за 3 июня 2026', 
        period: '3 июня 2026',
        date: '2026-06-03', 
        summary: 'Климатические изменения, встречи глав регионов, новые исследования вечной мерзлоты. Учёные зафиксировали рекордное таяние льдов в регионе.', 
        count: 15,
        sources: ['РИА Новости', 'Наука и жизнь'],
        topNews: [
          { id: 301, title: 'Учёные зафиксировали рекордное таяние льдов', views: 2100, category: 'Климат' },
          { id: 302, title: 'Встреча глав арктических регионов', views: 1450, category: 'Политика' },
          { id: 303, title: 'Новые данные о вечной мерзлоте', views: 1200, category: 'Наука' },
        ]
      },
      { 
        id: 4, 
        title: 'Дайджест за 2 июня 2026', 
        period: '2 июня 2026',
        date: '2026-06-02', 
        summary: 'Развитие Северного морского пути, новые инвестиционные проекты. Объявлено о строительстве новых портовых терминалов.', 
        count: 10,
        sources: ['Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 401, title: 'Новые портовые терминалы на Севморпути', views: 980, category: 'Экономика' },
          { id: 402, title: 'Инвестиции в арктические проекты', views: 870, category: 'Экономика' },
        ]
      },
      { 
        id: 5, 
        title: 'Дайджест за 1 июня 2026', 
        period: '1 июня 2026',
        date: '2026-06-01', 
        summary: 'Старт летней навигации на Севморпути. Первые караваны судов отправились по маршруту.', 
        count: 7,
        sources: ['ТАСС'],
        topNews: [
          { id: 501, title: 'Первые караваны судов отправились по Севморпути', views: 750, category: 'Инфраструктура' },
        ]
      },
    ],
    weekly: [
      { 
        id: 1, 
        title: 'Недельный дайджест: 1-7 июня 2026', 
        period: '1–7 июня 2026',
        date: '2026-06-01/2026-06-07', 
        summary: 'Ключевые события недели: форумы, соглашения, запуски проектов в арктических регионах. Подведены итоги международного арктического форума в Санкт-Петербурге.', 
        count: 45,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 101, title: 'Международный арктический форум в Санкт-Петербурге', views: 5600, category: 'Политика' },
          { id: 102, title: 'Запуск ледокола "Арктика-2"', views: 4300, category: 'Инфраструктура' },
          { id: 103, title: 'Соглашение России и Китая по Севморпути', views: 3900, category: 'Экономика' },
        ]
      },
      { 
        id: 2, 
        title: 'Недельный дайджест: 25-31 мая 2026', 
        period: '25–31 мая 2026',
        date: '2026-05-25/2026-05-31', 
        summary: 'Обзор главных арктических новостей за неделю: экология, экономика, наука. Новые исследования климата и их влияние на регион.', 
        count: 38,
        sources: ['ТАСС', 'РИА Новости'],
        topNews: [
          { id: 201, title: 'Новые исследования климата в Арктике', views: 3200, category: 'Климат' },
          { id: 202, title: 'Экологические инициативы в регионе', views: 2800, category: 'Экология' },
        ]
      },
      { 
        id: 3, 
        title: 'Недельный дайджест: 18-24 мая 2026', 
        period: '18–24 мая 2026',
        date: '2026-05-18/2026-05-24', 
        summary: 'Международное сотрудничество, инфраструктурные проекты. Визит делегации Китая в Мурманск.', 
        count: 42,
        sources: ['Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 301, title: 'Визит делегации Китая в Мурманск', views: 2500, category: 'Политика' },
          { id: 302, title: 'Новые проекты в арктической зоне', views: 2100, category: 'Экономика' },
        ]
      },
    ],
    monthly: [
      { 
        id: 1, 
        title: 'Майский дайджест 2026', 
        period: 'Май 2026',
        date: 'Май 2026', 
        summary: 'Все важные события Арктики за май: аналитика, интервью, итоги работы за месяц. Обзор ключевых решений в области арктической политики.', 
        count: 120,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ', 'Интерфакс', 'Арктический совет'],
        topNews: [
          { id: 101, title: 'Итоги весенней сессии Арктического совета', views: 8900, category: 'Политика' },
          { id: 102, title: 'Ключевые решения в области арктической политики', views: 7200, category: 'Политика' },
          { id: 103, title: 'Новые экологические нормы для Арктики', views: 6500, category: 'Экология' },
        ]
      },
      { 
        id: 2, 
        title: 'Апрельский дайджест 2026', 
        period: 'Апрель 2026',
        date: 'Апрель 2026', 
        summary: 'Экологические инициативы, запуск новых программ, международные соглашения. Итоги весенней сессии арктического совета.', 
        count: 98,
        sources: ['ТАСС', 'РИА Новости'],
        topNews: [
          { id: 201, title: 'Запуск новых программ развития Арктики', views: 5400, category: 'Экономика' },
          { id: 202, title: 'Международные соглашения по Арктике', views: 4800, category: 'Политика' },
        ]
      },
    ],
  }

  const tabItems = [
    { key: 'daily', label: isMobile ? '📅 День' : '📅 Ежедневные', count: digests.daily.length },
    { key: 'weekly', label: isMobile ? '📆 Неделя' : '📆 Еженедельные', count: digests.weekly.length },
    { key: 'monthly', label: isMobile ? '📊 Месяц' : '📊 Ежемесячные', count: digests.monthly.length },
  ]

  const currentDigests = digests[activeTab]

  const openDigest = (digestId, type) => {
    navigate(`/digests/${type}/${digestId}`)
  }

  const openNews = (newsId, e) => {
    e.stopPropagation()
    navigate(`/news/${newsId}`)
  }

  const getPeriodIcon = (period) => {
    if (period.includes('–')) return '📆'
    if (period.includes('Май') || period.includes('Апрель')) return '📊'
    return '📅'
  }

  // Стили для обрезки текста
  const textEllipsis = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    wordBreak: 'break-word'
  }

  return (
    <div>
      {/* Заголовок */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={isMobile ? 3 : 2} style={{ color: '#0A2B4E', margin: 0 }}>
            📚 Архив дайджестов
          </Title>
          {!isMobile && (
            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
              Ежедневные, еженедельные и ежемесячные сводки ключевых событий Арктики
            </Text>
          )}
        </div>
        {isMobile && (
          <Button icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)}>
            {tabItems.find(t => t.key === activeTab)?.label}
          </Button>
        )}
      </div>

      {isMobile && (
        <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
          Ежедневные, еженедельные и ежемесячные сводки ключевых событий Арктики
        </Text>
      )}

      {/* Десктопные табы */}
      {!isMobile && (
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: 24 }}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <Space>
                <span>{item.label}</span>
                <Tag color="blue" style={{ borderRadius: 12 }}>{item.count}</Tag>
              </Space>
            )
          }))}
        />
      )}

      {/* Мобильный Drawer для выбора периода */}
      <Drawer
        title="Выберите период"
        placement="bottom"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        size="default"
        styles={{ body: { padding: '16px' } }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {tabItems.map(item => (
            <Button 
              key={item.key}
              type={activeTab === item.key ? 'primary' : 'default'}
              block
              onClick={() => {
                setActiveTab(item.key)
                setMobileMenuOpen(false)
              }}
              style={{ textAlign: 'left', height: 'auto', padding: '12px' }}
            >
              {item.label}
              <Tag style={{ marginLeft: 8 }}>{item.count}</Tag>
            </Button>
          ))}
        </Space>
      </Drawer>

      {/* Контент */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spin size="large" description="Загрузка дайджестов..." />
        </div>
      ) : !currentDigests || currentDigests.length === 0 ? (
        <Empty description="Дайджесты не найдены" />
      ) : (
        <Row gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}>
          {currentDigests.map(digest => (
            <Col xs={24} sm={12} lg={8} xl={6} key={digest.id}>
              <Card 
                hoverable
                style={{ borderRadius: 16, height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                styles={{ body: { padding: isMobile ? 16 : 20, flex: 1, display: 'flex', flexDirection: 'column' } }}
                onClick={() => openDigest(digest.id, activeTab)}
              >
                {/* Верхняя часть с датой */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  <Space wrap>
                    <Avatar 
                      style={{ 
                        backgroundColor: activeTab === 'daily' ? '#4A90E2' : activeTab === 'weekly' ? '#2E8B57' : '#00A8A8',
                        fontSize: isMobile ? 16 : 20,
                        flexShrink: 0
                      }}
                      size={isMobile ? 40 : 48}
                    >
                      {getPeriodIcon(digest.period)}
                    </Avatar>
                    <div>
                      <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12, display: 'block', ...textEllipsis }}>
                        <CalendarOutlined /> {digest.period}
                      </Text>
                      <div>
                        <Tag color="gold" style={{ marginTop: 4 }}>
                          📄 {digest.count} новостей
                        </Tag>
                      </div>
                    </div>
                  </Space>
                  <Tooltip title="Читать полностью">
                    <Button 
                      type="primary" 
                      shape="circle" 
                      icon={<EyeOutlined />}
                      size={isMobile ? 'small' : 'middle'}
                      style={{ background: '#4A90E2', flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        openDigest(digest.id, activeTab)
                      }}
                    />
                  </Tooltip>
                </div>

                {/* Заголовок */}
                <Title 
                  level={isMobile ? 5 : 4} 
                  style={{ 
                    marginBottom: 12,
                    ...textEllipsis,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {digest.title}
                </Title>

                {/* Краткое описание */}
                <Paragraph 
                  type="secondary" 
                  ellipsis={{ rows: isMobile ? 2 : 2 }} 
                  style={{ 
                    marginBottom: 16, 
                    fontSize: isMobile ? 12 : 14,
                    ...textEllipsis
                  }}
                >
                  {digest.summary}
                </Paragraph>

                {/* ТОП-3 ПОПУЛЯРНЫЕ НОВОСТИ */}
                {digest.topNews && digest.topNews.length > 0 && (
                  <div style={{ 
                    marginBottom: 16,
                    background: '#FFF8E7',
                    borderRadius: 12,
                    padding: '12px',
                    borderLeft: '3px solid #FF6B35'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <FireOutlined style={{ color: '#FF6B35', fontSize: 14 }} />
                      <Text strong style={{ fontSize: 12, color: '#FF6B35' }}>Популярное в дайджесте</Text>
                    </div>
                    <List
                      size="small"
                      dataSource={digest.topNews.slice(0, 3)}
                      renderItem={(news, idx) => (
                        <div 
                          key={news.id}
                          style={{ 
                            padding: '6px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                            borderBottom: idx !== Math.min(digest.topNews.length, 3) - 1 ? '1px solid #FFF0D0' : 'none'
                          }}
                          onClick={(e) => openNews(news.id, e)}
                        >
                          <div style={{
                            width: 20,
                            height: 20,
                            background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 'bold',
                            color: '#333',
                            flexShrink: 0,
                            marginTop: 2
                          }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text 
                              style={{ 
                                fontSize: 12, 
                                display: 'block',
                                ...textEllipsis,
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                              }}
                            >
                              {news.title}
                            </Text>
                            <Space size={4} style={{ marginTop: 4 }}>
                              <Tag color="blue" style={{ fontSize: 9, padding: '0 4px', lineHeight: '16px', margin: 0 }}>
                                {news.category}
                              </Tag>
                              <Text type="secondary" style={{ fontSize: 10 }}>
                                👁 {news.views}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Источники */}
                <div style={{ marginBottom: 12 }}>
                  <Space wrap size={[4, 4]}>
                    {digest.sources.slice(0, 3).map(source => (
                      <Tag key={source} color="blue" style={{ fontSize: isMobile ? 10 : 11 }}>
                        {source}
                      </Tag>
                    ))}
                    {digest.sources.length > 3 && (
                      <Tag>+{digest.sources.length - 3}</Tag>
                    )}
                  </Space>
                </div>

                {/* Кнопка "Читать полностью" */}
                <Button 
                  type="link" 
                  icon={<FileTextOutlined />}
                  style={{ paddingLeft: 0, color: '#4A90E2', marginTop: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    openDigest(digest.id, activeTab)
                  }}
                >
                  Читать полностью →
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default DigestsPage