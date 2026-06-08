import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, Tag, Divider, message, Spin, Row, Col, Tooltip, Input } from 'antd'
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  EyeOutlined,
  ShareAltOutlined,
  CheckOutlined,
  GlobalOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { Title, Text, Paragraph } = Typography

const numberColors = ['rgb(60, 127, 199)', 'rgb(56, 159, 160)', 'rgb(60, 186, 133)']

const periodTopics = [
  'Арктика',
  'Северный морской путь',
  'Экология',
  'Наука',
  'Инфраструктура',
]

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
        { id: 1, title: 'Новая арктическая экспедиция стартовала из Мурманска', source: 'ТАСС', tags: ['Наука', 'Климат'], date: '2026-06-05', views: 3452, summary: 'Учёные отправились изучать изменение климата в регионе. Экспедиция продлится 3 месяца.' },
        { id: 2, title: 'Россия и Китай укрепляют сотрудничество в Арктике', source: 'РИА Новости', tags: ['Политика', 'Арктика'], date: '2026-06-05', views: 2891, summary: 'Подписано соглашение о развитии Северного морского пути.' },
        { id: 3, title: 'Новые экологические стандарты для арктических регионов', source: 'Коммерсантъ', tags: ['Экология'], date: '2026-06-05', views: 2156, summary: 'Минприроды ужесточает требования к промышленным предприятиям.' },
        { id: 4, title: 'Запущен новый ледокол "Арктика-2"', source: 'Интерфакс', tags: ['Инфраструктура'], date: '2026-06-04', views: 1872, summary: 'На Балтийском заводе спущен на воду новый атомный ледокол.' },
        { id: 5, title: 'Учёные зафиксировали рекордное таяние льдов', source: 'Наука и жизнь', tags: ['Климат', 'Арктика'], date: '2026-06-03', views: 1567, summary: 'Температура в Арктике побила 100-летний максимум.' },
      ],
      stats: { totalNews: 5, categories: ['Наука', 'Политика', 'Экология', 'Инфраструктура', 'Климат'], topSources: ['ТАСС', 'РИА Новости', 'Коммерсантъ'] }
    }
  }
  const weeklyDigests = {
    1: {
      id: 1,
      title: 'Недельный дайджест: 1–7 июня 2026',
      period: '1–7 июня 2026',
      type: 'weekly',
      createdAt: '2026-06-07 20:00',
      summary: 'Насыщенная неделя для Арктики: международный форум, спуск нового ледокола, соглашения о сотрудничестве и тревожные климатические данные.',
      news: [
        { id: 1, title: 'Международный арктический форум завершился в Санкт-Петербурге', source: 'ТАСС', tags: ['Политика', 'Арктика'], date: '2026-06-07', views: 5120, summary: 'Форум собрал представителей 15 государств. Подписано 12 межправительственных соглашений о сотрудничестве в Арктике.' },
        { id: 2, title: 'Запуск ледокола "Арктика-2"', source: 'Интерфакс', tags: ['Инфраструктура'], date: '2026-06-06', views: 4380, summary: 'На Балтийском заводе спущен на воду новый атомный ледокол проекта 22220. Судно обеспечит круглогодичную навигацию по Севморпути.' },
        { id: 3, title: 'Россия и Китай подписали соглашение по Севморпути', source: 'РИА Новости', tags: ['Политика', 'Экономика'], date: '2026-06-06', views: 3950, summary: 'Стороны договорились о совместном развитии инфраструктуры и синхронизации транспортных коридоров.' },
        { id: 4, title: 'Новая арктическая экспедиция стартовала из Мурманска', source: 'ТАСС', tags: ['Наука', 'Климат'], date: '2026-06-05', views: 3452, summary: 'Учёные из России, Китая и Индии отправились исследовать изменения климата. Экспедиция продлится три месяца.' },
        { id: 5, title: 'Новые экологические стандарты для арктических регионов', source: 'Коммерсантъ', tags: ['Экология'], date: '2026-06-05', views: 2156, summary: 'Минприроды ужесточает требования к промышленным предприятиям, работающим в Арктической зоне.' },
        { id: 6, title: 'Учёные зафиксировали рекордное таяние льдов', source: 'Наука и жизнь', tags: ['Климат', 'Арктика'], date: '2026-06-03', views: 1980, summary: 'Температура в Арктике побила 100-летний максимум. Площадь льда сократилась до исторического минимума для этого времени года.' },
        { id: 7, title: 'Первые грузовые конвои вышли по Севморпути', source: 'Интерфакс', tags: ['Инфраструктура', 'Судоходство'], date: '2026-06-01', views: 1640, summary: 'Стартовала летняя навигационная кампания. Первые конвои взяли курс на восток в сопровождении атомных ледоколов.' },
      ],
      stats: { totalNews: 7, categories: ['Политика', 'Инфраструктура', 'Наука', 'Климат', 'Экология'], topSources: ['ТАСС', 'Интерфакс', 'РИА Новости', 'Коммерсантъ'] }
    }
  }
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
  const [visibleCount, setVisibleCount] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    setTimeout(() => {
      setDigest(getDigestData(id, type))
      setLoading(false)
    }, 300)
    return () => window.removeEventListener('resize', handleResize)
  }, [id, type])

  const handlePrint = () => window.print()

  const handlePDF = async () => {
    if (!contentRef.current) return
    message.loading('Создание PDF...', 0)
    try {
      const filterBlock = contentRef.current.querySelector('.no-print')
      if (filterBlock) filterBlock.style.display = 'none'
      const canvas = await html2canvas(contentRef.current, { scale: 2, backgroundColor: '#ffffff', logging: false })
      if (filterBlock) filterBlock.style.display = ''
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgWidth = 210
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, (canvas.height * imgWidth) / canvas.width)
      pdf.save(`${digest.title}.pdf`)
      message.success('PDF успешно создан')
    } catch {
      message.error('Ошибка при создании PDF')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    message.success('Ссылка скопирована')
  }

  const topNews = digest?.news ? [...digest.news].sort((a, b) => b.views - a.views).slice(0, 3) : []

  const allCategories = digest?.news
    ? [...new Set(digest.news.flatMap(n => n.tags || []))]
    : []

  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setVisibleCount(5)
  }

  const filteredNews = digest?.news
    ? digest.news.filter(item => {
        const matchSearch = !searchQuery ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchCategory = selectedCategories.length === 0 ||
          (item.tags || []).some(t => selectedCategories.includes(t))
        return matchSearch && matchCategory
      })
    : []

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div ref={contentRef}>

      {/* 1. Заголовок */}
      <Title level={isMobile ? 3 : 2} style={{ color: '#0A2B4E', margin: '0px 5px 30px' }}>
        {digest.title}
      </Title>

      {/* 2. Кнопки действий */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/digests')}>
          Назад к списку
        </Button>
        <Tooltip title="Версия для печати">
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>Печать</Button>
        </Tooltip>
        <Tooltip title="Поделиться ссылкой">
          <Button icon={copied ? <CheckOutlined /> : <ShareAltOutlined />} onClick={copyLink}>
            {copied ? 'Скопировано!' : 'Поделиться'}
          </Button>
        </Tooltip>
        <Tooltip title="Сохранить как PDF">
          <Button icon={<FilePdfOutlined />} onClick={handlePDF} style={{ background: '#E53E3E', color: 'white', borderColor: '#E53E3E' }}>
            Сохранить PDF
          </Button>
        </Tooltip>
      </div>

      {/* 3. Краткая выжимка */}
      <div style={{
        background: 'rgb(240, 244, 250)',
        borderLeft: '3px solid #4A90E2',
        borderRadius: '0 8px 8px 0',
        padding: '12px 16px',
        marginBottom: 28,
      }}>
        <Text strong style={{ color: '#0A2B4E', fontSize: 13 }}>Обзор периода</Text>
        <div style={{ marginTop: 10, marginBottom: 12 }}>
          <Space wrap size={[6, 6]}>
            {periodTopics.map(topic => (
              <Tag
                key={topic}
                style={{
                  background: '#E6F4FF',
                  border: '1px solid #91CAFF',
                  color: '#0A2B4E',
                }}
              >
                {topic}
              </Tag>
            ))}
          </Space>
        </div>
        <Paragraph style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: isMobile ? 13 : 15,
          color: '#333',
          margin: '10px 0 0 0',
          lineHeight: 1.7,
        }}>
          «{digest.summary}»
        </Paragraph>
      </div>

      {/* 4. Топ-3 популярных новости */}
      {topNews.length > 0 && (
        <>
          <Title level={isMobile ? 4 : 3} style={{ color: '#0A2B4E', marginBottom: 16, marginTop: 40 }}>
            Главные новости {digest.type === 'daily' ? 'дня' : digest.type === 'weekly' ? 'недели' : 'месяца'}
          </Title>
          <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginBottom: 32 }}>
            {topNews.map((news, idx) => (
              <Col xs={24} md={8} key={news.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  styles={{
                    body: {
                      padding: isMobile ? 14 : 16,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    },
                  }}
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  {/* Номер + теги */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: numberColors[idx],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 'bold', color: '#fff', flexShrink: 0,
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 4, overflow: 'hidden', alignItems: 'center' }}>
                      {news.tags?.map(tag => (
                        <Tag key={tag} color="#4A90E2" style={{ fontSize: 10, padding: '0 5px', lineHeight: '16px', margin: 0, flexShrink: 0 }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <Title level={5} style={{ marginBottom: 8 }}>{news.title}</Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12, marginBottom: 12 }}>
                    {news.summary}
                  </Paragraph>

                  <Button
                    type="link"
                    style={{
                      color: '#4A90E2',
                      padding: 0,
                      fontSize: 12,
                      marginTop: 'auto',
                      alignSelf: 'flex-end',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/news/${news.id}`)
                    }}
                  >
                    Читать далее
                  </Button>
                  
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* 5. Все новости дайджеста */}
      {digest.news !== undefined && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Title level={isMobile ? 4 : 3} style={{ color: '#0A2B4E', margin: 0 }}>
              Все новости дайджеста
            </Title>
            <Tag style={{ background: 'rgb(171, 231, 213)', border: '1px solid rgb(52, 183, 128)', color: 'rgb(37, 73, 70)', margin: 0, fontSize: 13, padding: 5 }}>
              {digest.stats.totalNews} новостей
            </Tag>
          </div>

          {/* Блок фильтрации (только для недельного дайджеста) */}
        
          <div className="no-print" style={{
            background: 'rgb(217, 235, 250)',
            border: '1px solid #D6E4F5',
            borderRadius: 12,
            padding: isMobile ? '14px 14px' : '16px 20px',
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {/* Строка 1: поиск по заголовку */}
            <Input
              placeholder="Поиск по заголовку..."
              prefix={<SearchOutlined style={{ color: '#4A90E2' }} />}
              allowClear
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(10) }}
              size={isMobile ? 'middle' : 'large'}
              style={{ borderRadius: 8 }}
            />

            {/* Строка 2: категории */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {allCategories.map(cat => {
                const active = selectedCategories.includes(cat)
                return (
                  <Button
                    key={cat}
                    size={isMobile ? 'small' : 'middle'}
                    onClick={() => handleCategoryToggle(cat)}
                    style={{
                      borderRadius: 20,
                      borderColor: '#4A90E2',
                      backgroundColor: active ? '#4A90E2' : 'white',
                      color: active ? 'white' : '#4A90E2',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.2s',
                      padding: '15px',
                    }}
                  >
                    {cat}
                  </Button>
                )
              })}
              {(searchQuery || selectedCategories.length > 0) && (
                <Button
                  size={isMobile ? 'small' : 'middle'}
                  type="text"
                  onClick={() => { setSearchQuery(''); setSelectedCategories([]); setVisibleCount(5) }}
                  style={{ color: '#999', fontSize: 12 }}
                >
                  Сбросить
                </Button>
              )}
            </div>
          </div>
          

          {filteredNews.length === 0 ? (
            <Text type="secondary">Нет новостей по заданным фильтрам</Text>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
                {filteredNews.slice(0, visibleCount).map((item) => (
                  <Card
                    key={item.id}
                    hoverable
                    style={{ borderRadius: 12, cursor: 'pointer' }}
                    styles={{ body: { padding: isMobile ? 14 : 20 } }}
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <Space wrap style={{ marginBottom: 10 }} size={[12, 8]}>
                      <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                        <CalendarOutlined /> {item.date}
                      </Text>
                      <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                        <GlobalOutlined /> {item.source}
                      </Text>
                      <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                        <EyeOutlined /> {item.views.toLocaleString('ru-RU')}
                      </Text>
                    </Space>
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, marginBottom: 10, overflow: 'hidden' }}>
                        {item.tags.map(tag => (
                          <Tag key={tag} color="#4A90E2" style={{ fontSize: isMobile ? 11 : 12, marginInlineEnd: 0, flexShrink: 0 }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                    <Title level={isMobile ? 5 : 4} style={{ margin: '0 0 8px' }}>
                      {item.title}
                    </Title>
                    <Paragraph type="secondary" ellipsis={{ rows: isMobile ? 2 : 3 }} style={{ fontSize: isMobile ? 12 : 14, marginBottom: 12 }}>
                      {item.summary}
                    </Paragraph>
                    <Button
                      type="link"
                      size={isMobile ? 'small' : 'middle'}
                      style={{ paddingLeft: 0, color: '#4A90E2' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/news/${item.id}`) }}
                    >
                      Читать далее
                    </Button>
                  </Card>
                ))}
              </div>
              {visibleCount < filteredNews.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                  <Button
                    onClick={() => setVisibleCount(v => v + 5)}
                    style={{ color: '#4A90E2', borderColor: '#4A90E2', width: isMobile ? '100%' : '300px' }}
                  >
                    Показать ещё ({filteredNews.length - visibleCount} осталось)
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 7. Источники */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #E5E5E5' }}>
        <Text type="secondary" style={{ fontSize: isMobile ? 10 : 11, display: 'block', marginBottom: 8 }}>
          Источники:
        </Text>
        <Space wrap size={[4, 4]}>
          {digest.stats.topSources.map(source => (
            <Tag key={source} style={{ fontSize: isMobile ? 10 : 11, background: '#F0F4FA', border: '1px solid #C8D8F0', color: '#0A2B4E' }}>
              {source}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 8. Футер */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E5E5', fontSize: 12, color: '#999' }}>
        <div>Дата публикации: {digest.createdAt}</div>
      </div>

      <style>{`
        @media print {
          .ant-btn { display: none !important; }
          .ant-card { break-inside: avoid; }
          .no-print { display: none !important; }
          .ant-tooltip { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default DigestViewPage