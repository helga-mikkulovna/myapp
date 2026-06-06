import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Space, Divider, message, Tooltip, Typography, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  CheckOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

// Демо-данные новости
const getNewsData = (id) => {
  return {
    id: id,
    title: 'Новая арктическая экспедиция стартовала из Мурманска',
    date: '5 июня 2026, 10:30',
    source: 'ТАСС',
    author: 'Иван Петров',
    category: 'Наука',
    image_url: null,
    summary: 'Учёные отправились изучать изменение климата в регионе. Экспедиция продлится 3 месяца и охватит труднодоступные районы Арктики.',
    content: `
      <p><strong>МУРМАНСК, 5 июня. /ТАСС/.</strong> Научно-исследовательское судно «Академик Мстислав Келдыш» вышло из мурманского порта в пятницу утром. На борту — 45 исследователей из России, Китая и Индии, которым предстоит провести в Арктике три месяца.</p>

      <p>Экспедиция работает в рамках международной программы «Арктика — 2030», запущенной в 2023 году. Нынешний выход — уже третий по счёту: предыдущие рейсы зафиксировали заметное ускорение таяния ледников, что и определило повестку нового исследования. Учёные сосредоточатся на динамике вечной мерзлоты, изменениях солёности воды и смещении миграционных маршрутов морских животных.</p>

      <p>«Арктика нагревается примерно вдвое быстрее, чем планета в среднем, и каждый новый сезон приносит данные, которые меняют наши прогнозные модели», — сказал руководитель экспедиции, старший научный сотрудник Института океанологии РАН Дмитрий Волков. По его словам, особый интерес представляют труднодоступные районы к северу от Новосибирских островов, куда прежде удавалось добраться лишь в отдельные годы.</p>

      <p>Российскую сторону представляют 25 специалистов Института океанологии РАН, китайскую — 12 сотрудников Полярного института Китая, индийскую — восемь исследователей Национального центра полярных исследований. Совместная работа трёх стран в Арктике ведётся с 2019 года и, по оценке участников, позволяет существенно расширить географию наблюдений за счёт параллельного развёртывания оборудования.</p>

      <p>Судно вернётся в Мурманск в начале сентября. Собранные материалы планируется передать в общую базу данных программы и опубликовать в открытом доступе до конца года.</p>
    `,
    tags: ['Арктика', 'Климат', 'Экспедиция', 'Наука', 'Международное сотрудничество'],
    related: [
      { id: 2, title: 'Россия и Китай укрепляют сотрудничество в Арктике' },
      { id: 3, title: 'Новые экологические стандарты для арктических регионов' },
      { id: 5, title: 'Учёные зафиксировали рекордное таяние льдов' },
    ],
    metadata: {
      views: 1247,
      created: '2026-06-05 10:30',
      updated: '2026-06-05 15:45',
    },
  }
}

const NewsViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [summaryCollapsed, setSummaryCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setNews(getNewsData(id))
      setLoading(false)
    }, 300)
  }, [id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    message.success('Ссылка скопирована')
  }

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      {/* 1. Заголовок */}
      <Title
        level={isMobile ? 3 : 2}
        style={{ color: '#0A2B4E', margin: '0px 0px 16px 0px' }}
      >
        {news.title}
      </Title>

      {/* 2. Теги */}
      {news.tags && news.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {news.tags.map(tag => (
            <Tag
              key={tag}
              color="#4A90E2"
              style={{ fontSize: isMobile ? 11 : 12, marginInlineEnd: 0 }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* 3. Дата, источник, просмотры */}
      <Space wrap style={{ marginBottom: 20 }} size={[16, 8]}>
        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
          <CalendarOutlined /> {news.date}
        </Text>
        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
          <EnvironmentOutlined /> {news.source}
        </Text>
        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
          <EyeOutlined /> {news.metadata.views.toLocaleString('ru-RU')} просмотров
        </Text>
      </Space>

      {/* 4. Кнопки действий */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/catalog')} icon={<ArrowLeftOutlined />}>
          Назад к списку
        </Button>
        <Button onClick={handlePrint} icon={<PrinterOutlined />}>
          Печать
        </Button>
        <Tooltip title="Скопировать ссылку">
          <Button
            icon={copied ? <CheckOutlined /> : <ShareAltOutlined />}
            onClick={copyLink}
          >
            {copied ? 'Скопировано!' : 'Поделиться'}
          </Button>
        </Tooltip>
      </div>

      {/* 5. Краткая выжимка */}
      <div
        style={{
          background: '#F0F4FA',
          borderLeft: '3px solid #4A90E2',
          borderRadius: '0 8px 8px 0',
          padding: '12px 16px',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ color: '#0A2B4E', fontSize: 13 }}>
            Краткая выжимка
          </Text>
          <Button
            type="text"
            size="small"
            icon={summaryCollapsed ? <DownOutlined /> : <UpOutlined />}
            onClick={() => setSummaryCollapsed(!summaryCollapsed)}
            style={{ color: '#4A90E2', fontSize: 12 }}
          >
            {summaryCollapsed ? 'Развернуть' : 'Свернуть'}
          </Button>
        </div>
        {!summaryCollapsed && (
          <Paragraph
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: isMobile ? 13 : 15,
              color: '#333',
              margin: '10px 0 0 0',
              lineHeight: 1.7,
            }}
          >
            «{news.summary}»
          </Paragraph>
        )}
      </div>

      {/* 6. Основной текст новости */}
      <div
        dangerouslySetInnerHTML={{ __html: news.content }}
        style={{ lineHeight: 1.75, fontSize: isMobile ? 14 : 15, color: '#1a1a1a' }}
      />

      {/* 7. Похожие статьи */}
      {news.related && news.related.length > 0 && (
        <>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 15, color: '#0A2B4E' }}>
              📖 Похожие статьи
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {news.related.map(article => (
              <div
                key={article.id}
                onClick={() => navigate(`/news/${article.id}`)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  color: '#4A90E2',
                  fontSize: isMobile ? 13 : 14,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#EBF3FF')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
              >
                → {article.title}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 8. Метаданные */}
      <div
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid #E5E5E5',
          fontSize: 12,
          color: '#999',
        }}
      >
        <div>Создано: {news.metadata.created}</div>
        <div>Обновлено: {news.metadata.updated}</div>
      </div>

      {/* Стили для печати */}
      <style>{`
        @media print {
          .ant-btn { display: none !important; }
          a { text-decoration: none; color: black; }
        }
      `}</style>
    </div>
  )
}

export default NewsViewPage