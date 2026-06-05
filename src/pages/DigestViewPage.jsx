import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Tag, Divider, List, message, Spin, Breadcrumb, Row, Col, Avatar, Tooltip, Statistic, Progress } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FilePdfOutlined, 
  CalendarOutlined, 
  EyeOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  BookOutlined,
  TagOutlined,
  FireOutlined,
  TrophyOutlined,
  StarOutlined
} from '@ant-design/icons'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { Title, Text, Paragraph } = Typography

// Получение данных дайджеста по ID и типу
const getDigestData = (id, type) => {
  const dailyDigests = {
    1: {
      id: 1,
      title: 'Дайджест за 5 июня 2026',
      period: '5 июня 2026',
      type: 'daily',
      createdAt: '2026-06-05 18:30',
      summary: 'Основные события Арктики за день: экологические инициативы, новые маршруты Севморпути, встречи глав регионов.',
      news: [
        { id: 1, title: 'Новая арктическая экспедиция стартовала из Мурманска', source: 'ТАСС', category: 'Наука', date: '2026-06-05', views: 3452, summary: 'Учёные отправились изучать изменение климата в регионе. Экспедиция продлится 3 месяца.' },
        { id: 2, title: 'Россия и Китай укрепляют сотрудничество в Арктике', source: 'РИА Новости', category: 'Политика', date: '2026-06-05', views: 2891, summary: 'Подписано соглашение о развитии Северного морского пути.' },
        { id: 3, title: 'Новые экологические стандарты для арктических регионов', source: 'Коммерсантъ', category: 'Экология', date: '2026-06-05', views: 2156, summary: 'Минприроды ужесточает требования к промышленным предприятиям.' },
        { id: 4, title: 'Запущен новый ледокол "Арктика-2"', source: 'Интерфакс', category: 'Инфраструктура', date: '2026-06-04', views: 1872, summary: 'На Балтийском заводе спущен на воду новый атомный ледокол.' },
        { id: 5, title: 'Учёные зафиксировали рекордное таяние льдов', source: 'Наука и жизнь', category: 'Климат', date: '2026-06-03', views: 1567, summary: 'Температура в Арктике побила 100-летний максимум.' },
      ],
      stats: { totalNews: 5, categories: ['Наука', 'Политика', 'Экология', 'Инфраструктура', 'Климат'], topSources: ['ТАСС', 'РИА Новости', 'Коммерсантъ'] }
    }
  }

  const weeklyDigests = { 1: { id: 1, title: 'Недельный дайджест: 1-7 июня 2026', period: '1–7 июня 2026', type: 'weekly', createdAt: '2026-06-07 20:00', summary: 'Ключевые события недели', news: [], stats: { totalNews: 3, categories: ['Политика'], topSources: ['ТАСС'] } } }
  const monthlyDigests = { 1: { id: 1, title: 'Майский дайджест 2026', period: 'Май 2026', type: 'monthly', createdAt: '2026-06-01 12:00', summary: 'Все важные события Арктики за май', news: [], stats: { totalNews: 2, categories: ['Политика'], topSources: ['Арктический совет'] } } }

  if (type === 'daily') return dailyDigests[id] || dailyDigests[1]
  if (type === 'weekly') return weeklyDigests[id] || weeklyDigests[1]
  return monthlyDigests[id] || monthlyDigests[1]
}

const DigestViewPage = () => {
  const { id, type } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef(null)
  const [digest, setDigest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    setTimeout(() => {
      const data = getDigestData(id, type)
      setDigest(data)
      setLoading(false)
    }, 300)
    return () => window.removeEventListener('resize', handleResize)
  }, [id, type])

  const handlePrint = () => window.print()

  const handlePDF = async () => {
    if (!contentRef.current) return
    message.loading('Создание PDF...', 0)
    try {
      const element = contentRef.current
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${digest.title}.pdf`)
      message.success('PDF успешно создан')
    } catch (error) {
      message.error('Ошибка при создании PDF')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    message.success('Ссылка скопирована')
  }

  // Получаем топ-3 популярные новости (по просмотрам)
  const getTopNews = () => {
    if (!digest?.news) return []
    return [...digest.news].sort((a, b) => b.views - a.views).slice(0, 3)
  }

  const topNews = getTopNews()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" description="Загрузка дайджеста..." />
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><a onClick={() => navigate('/')}>Главная</a></Breadcrumb.Item>
        <Breadcrumb.Item><a onClick={() => navigate('/digests')}>Дайджесты</a></Breadcrumb.Item>
        <Breadcrumb.Item>{digest.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/digests')}>Назад к списку</Button>
        <Space wrap>
          <Tooltip title="Версия для печати"><Button icon={<PrinterOutlined />} onClick={handlePrint}>Печать</Button></Tooltip>
          <Tooltip title="Сохранить как PDF"><Button icon={<FilePdfOutlined />} onClick={handlePDF} type="primary" style={{ background: '#E53E3E' }}>Сохранить PDF</Button></Tooltip>
          <Tooltip title="Поделиться ссылкой"><Button icon={copied ? <CheckOutlined /> : <ShareAltOutlined />} onClick={copyLink}>{copied ? 'Скопировано!' : 'Поделиться'}</Button></Tooltip>
        </Space>
      </div>

      <div ref={contentRef} id="digest-content" style={{ background: 'white', borderRadius: 16, overflow: 'hidden' }}>
        {/* Заголовок */}
        <div style={{ padding: isMobile ? '24px' : '40px', background: 'linear-gradient(135deg, #0A2B4E 0%, #1a4a7a 100%)', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️🧊</div>
            <Title level={1} style={{ color: 'white', margin: 0, fontSize: isMobile ? 24 : 32 }}>{digest.title}</Title>
          </div>
          <Row gutter={[16, 16]} justify="center">
            <Col><Tag icon={<CalendarOutlined />} color="cyan">Период: {digest.period}</Tag></Col>
            <Col><Tag icon={<ClockCircleOutlined />} color="green">Создан: {digest.createdAt}</Tag></Col>
            <Col><Tag icon={<BookOutlined />} color="blue">{digest.stats.totalNews} новостей</Tag></Col>
          </Row>
        </div>

        <div style={{ padding: isMobile ? '20px' : '32px' }}>
          {/* Аннотация */}
          <Card style={{ marginBottom: 24, borderRadius: 12, background: '#F5F7FA' }}>
            <Title level={4}>📋 Обзор дня</Title>
            <Paragraph style={{ fontSize: 16 }}>{digest.summary}</Paragraph>
          </Card>

          {/* Блок ТОП-3 популярных новостей */}
          {topNews.length > 0 && (
            <Card 
              style={{ 
                marginBottom: 32, 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4B5 100%)',
                border: '1px solid #FFD700'
              }}
              styles={{ body: { padding: isMobile ? 16 : 24 } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <FireOutlined style={{ fontSize: 24, color: '#FF6B35' }} />
                <Title level={4} style={{ margin: 0, color: '#FF6B35' }}>Топ-3 популярные новости дня</Title>
                <TrophyOutlined style={{ fontSize: 20, color: '#FFD700' }} />
              </div>
              
              <Row gutter={[16, 16]}>
                {topNews.map((news, idx) => (
                  <Col xs={24} md={8} key={news.id}>
                    <Card 
                      hoverable 
                      style={{ 
                        borderRadius: 12, 
                        cursor: 'pointer',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      styles={{ body: { padding: 16 } }}
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      {/* Медалька места */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 40,
                        height: 40,
                        background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                        borderBottomLeftRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: idx === 0 ? '#B8860B' : idx === 1 ? '#808080' : '#8B4513'
                      }}>
                        {idx + 1}
                      </div>
                      
                      <Space wrap style={{ marginBottom: 12 }}>
                        <Tag color="#4A90E2">{news.category}</Tag>
                        <Tag icon={<EyeOutlined />} color="orange">{news.views.toLocaleString()} просмотров</Tag>
                      </Space>
                      
                      <Title level={5} style={{ marginBottom: 12 }}>{news.title}</Title>
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                        {news.summary}
                      </Paragraph>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag icon={<GlobalOutlined />}>{news.source}</Tag>
                        <Button type="link" style={{ color: '#4A90E2', padding: 0 }} onClick={(e) => { e.stopPropagation(); navigate(`/news/${news.id}`) }}>
                          Читать →
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {/* Статистика */}
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            <Col xs={12} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 12 }}>
                <Statistic title="Всего новостей" value={digest.stats.totalNews} prefix={<BookOutlined />} valueStyle={{ color: '#4A90E2' }} />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 12 }}>
                <Statistic title="Категорий" value={digest.stats.categories.length} prefix={<TagOutlined />} valueStyle={{ color: '#2E8B57' }} />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 12 }}>
                <Statistic title="Источников" value={digest.stats.topSources.length} prefix={<GlobalOutlined />} valueStyle={{ color: '#E67E22' }} />
              </Card>
            </Col>
          </Row>

          {/* Список всех новостей */}
          <Title level={3} style={{ marginBottom: 16 }}>📰 Все новости дайджеста</Title>
          <List
            itemLayout="vertical"
            dataSource={digest.news}
            renderItem={(item, index) => (
              <List.Item 
                style={{ 
                  borderBottom: '1px solid #f0f0f0', 
                  paddingBottom: 20, 
                  marginBottom: 20, 
                  cursor: 'pointer',
                  background: index < 3 ? 'rgba(255, 235, 205, 0.3)' : 'transparent'
                }} 
                onClick={() => navigate(`/news/${item.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Avatar 
                    style={{ 
                      backgroundColor: index < 3 ? '#FF6B35' : '#4A90E2',
                      flexShrink: 0 
                    }} 
                    size={isMobile ? 32 : 40}
                  >
                    {index + 1}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                      <Tag color="#4A90E2">{item.category}</Tag>
                      <Tag icon={<GlobalOutlined />}>{item.source}</Tag>
                      <Tag icon={<CalendarOutlined />}>{item.date}</Tag>
                      <Tag icon={<EyeOutlined />} color="orange">{item.views.toLocaleString()} просмотров</Tag>
                      {index < 3 && <Tag icon={<FireOutlined />} color="red">Популярное</Tag>}
                    </div>
                    <Title level={isMobile ? 5 : 4} style={{ marginBottom: 8 }}>{item.title}</Title>
                    <Paragraph>{item.summary}</Paragraph>
                    <Button type="link" style={{ paddingLeft: 0, color: '#4A90E2' }} onClick={(e) => { e.stopPropagation(); navigate(`/news/${item.id}`) }}>
                      Читать полностью →
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />

          <Divider />
          <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            <Text type="secondary">© 2026 Арктический информационно-аналитический портал<br />Дата публикации: {digest.createdAt}</Text>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .ant-btn, .ant-breadcrumb { display: none !important; }
          #digest-content { margin: 0; padding: 0; border-radius: 0; }
          .ant-card { break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}

export default DigestViewPage