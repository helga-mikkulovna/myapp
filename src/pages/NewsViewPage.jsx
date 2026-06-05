import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Breadcrumb, Tag, Button, Space, Divider, message, Tooltip, Avatar } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  ShareAltOutlined,
  CopyOutlined,
  CheckOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons'

// Демо-данные новости
const getNewsData = (id) => {
  return {
    id: id,
    title: 'Новая арктическая экспедиция стартовала из Мурманска',
    title_en: 'New Arctic expedition launched from Murmansk',
    date: '5 июня 2026',
    source: 'ТАСС',
    author: 'Иван Петров',
    category: 'Наука',
    category_en: 'Science',
    image_url: null,
    summary: 'Учёные отправились изучать изменение климата в регионе. Экспедиция продлится 3 месяца и охватит труднодоступные районы Арктики.',
    content: `
      <p><strong>МУРМАНСК, 5 июня. /ТАСС/.</strong> Научно-исследовательское судно «Академик Мстислав Келдыш» отправилось в Арктическую экспедицию. Учёные из России, Китая и Индии будут изучать изменения климата в регионе.</p>
      
      <p>Экспедиция продлится три месяца. За это время исследователи планируют собрать уникальные данные о таянии вечной мерзлоты, изменении солёности воды и миграции морских животных.</p>
      
      <h2>Цели экспедиции</h2>
      <ul>
        <li>Изучение климатических изменений в высоких широтах</li>
        <li>Мониторинг состояния вечной мерзлоты</li>
        <li>Исследование биоразнообразия арктических морей</li>
        <li>Сбор данных для прогнозирования климата</li>
      </ul>
      
      <p>По словам руководителя экспедиции, полученные данные помогут улучшить модели климатических прогнозов и оценить последствия глобального потепления для Арктики.</p>
      
      <div class="wiki-card">
        <strong>📌 Контекст:</strong> Это уже третья экспедиция в рамках международной программы «Арктика — 2030». Предыдущие исследования показали ускорение таяния ледников в регионе.
      </div>
      
      <h2>Участники</h2>
      <p>В экспедиции принимают участие 45 учёных из трёх стран:</p>
      <ul>
        <li>Россия — 25 исследователей (Институт океанологии РАН)</li>
        <li>Китай — 12 исследователей (Полярный институт Китая)</li>
        <li>Индия — 8 исследователей (Национальный центр полярных исследований)</li>
      </ul>
      
      <h2>Значение для науки</h2>
      <p>Арктический регион нагревается в два раза быстрее, чем остальная часть планеты. Понимание процессов, происходящих в Арктике, критически важно для глобальных климатических прогнозов.</p>
    `,
    tags: ['Арктика', 'Климат', 'Экспедиция', 'Наука', 'Международное сотрудничество'],
    related: [
      { id: 2, title: 'Россия и Китай укрепляют сотрудничество в Арктике' },
      { id: 3, title: 'Новые экологические стандарты для арктических регионов' },
      { id: 5, title: 'Учёные зафиксировали рекордное таяние льдов' }
    ],
    metadata: {
      views: 1247,
      created: '2026-06-05 10:30',
      updated: '2026-06-05 15:45'
    }
  }
}

const NewsViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Загрузка данных
    setTimeout(() => {
      const data = getNewsData(id)
      setNews(data)
      setLoading(false)
    }, 300)
  }, [id])

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    message.success('Ссылка скопирована')
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="wiki-content">
      {/* Хлебные крошки в вики-стиле */}
      <div style={{ fontSize: '14px', marginBottom: '16px' }}>
        <a onClick={() => navigate('/')}>Главная</a> › 
        <a onClick={() => navigate('/catalog')}> Каталог новостей</a> › 
        <span style={{ color: '#0645AD' }}> {news.title.substring(0, 50)}...</span>
      </div>

      {/* Заголовок */}
      <h1>{news.title}</h1>

      {/* Инфобокс (справа на десктопе) */}
      <div className="wiki-infobox">
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', background: '#E5E5E5', padding: '4px' }}>
                <strong>{news.category}</strong>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Дата:</td>
              <td>{news.date}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Источник:</td>
              <td><a href="#">{news.source}</a></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Автор:</td>
              <td>{news.author}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Просмотров:</td>
              <td>{news.metadata.views}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Краткое описание */}
      <div style={{ 
        fontSize: '16px', 
        color: '#202122', 
        marginBottom: '24px',
        fontFamily: 'Georgia, serif',
        borderLeft: '3px solid #0645AD',
        paddingLeft: '16px'
      }}>
        {news.summary}
      </div>

      {/* Кнопки действий */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/catalog')} icon={<ArrowLeftOutlined />}>
          Назад к списку
        </Button>
        <Button onClick={handlePrint} icon={<PrinterOutlined />}>
          Печать
        </Button>
        <Tooltip title="Поделиться">
          <Button 
            icon={copied ? <CheckOutlined /> : <ShareAltOutlined />} 
            onClick={copyLink}
          >
            {copied ? 'Скопировано!' : 'Поделиться'}
          </Button>
        </Tooltip>
      </div>

      {/* Основной контент */}
      <div 
        dangerouslySetInnerHTML={{ __html: news.content }}
        style={{ 
          lineHeight: 1.6,
          fontSize: '15px'
        }}
      />

      {/* Теги */}
      {news.tags && news.tags.length > 0 && (
        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
          <strong>Теги:</strong>
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {news.tags.map(tag => (
              <Tag key={tag} style={{ background: '#F8F9FA', border: '1px solid #E5E5E5' }}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Похожие статьи */}
      {news.related && news.related.length > 0 && (
        <>
          <Divider />
          <div className="wiki-toc" style={{ width: '100%' }}>
            <div className="wiki-toc-title">📖 Похожие статьи</div>
            <ul style={{ margin: '8px 0 0 0' }}>
              {news.related.map(article => (
                <li key={article.id}>
                  <a onClick={() => navigate(`/news/${article.id}`)}>{article.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Метаданные */}
      <div style={{ 
        marginTop: '32px', 
        paddingTop: '16px', 
        borderTop: '1px solid #E5E5E5',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>Создано: {news.metadata.created}</div>
        <div>Обновлено: {news.metadata.updated}</div>
      </div>

      {/* Стили для печати */}
      <style>{`
        @media print {
          .ant-btn {
            display: none !important;
          }
          .wiki-infobox {
            float: right;
            width: 250px;
          }
          a {
            text-decoration: none;
            color: black;
          }
        }
      `}</style>
    </div>
  )
}

export default NewsViewPage