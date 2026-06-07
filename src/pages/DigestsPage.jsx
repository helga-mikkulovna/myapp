import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Typography, Tabs, Button, Space, Tag, Empty, Spin, Drawer, DatePicker, Select } from 'antd'
import { CalendarOutlined, FileTextOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const { Title, Paragraph, Text } = Typography
const { RangePicker } = DatePicker

const MONTHS = [
  { value: 'Январь', label: 'Январь' },
  { value: 'Февраль', label: 'Февраль' },
  { value: 'Март', label: 'Март' },
  { value: 'Апрель', label: 'Апрель' },
  { value: 'Май', label: 'Май' },
  { value: 'Июнь', label: 'Июнь' },
  { value: 'Июль', label: 'Июль' },
  { value: 'Август', label: 'Август' },
  { value: 'Сентябрь', label: 'Сентябрь' },
  { value: 'Октябрь', label: 'Октябрь' },
  { value: 'Ноябрь', label: 'Ноябрь' },
  { value: 'Декабрь', label: 'Декабрь' },
]

const DigestsPage = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [activeTab, setActiveTab] = useState('daily')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Фильтры
  const [dateRange, setDateRange] = useState([null, null])   // для daily и weekly
  const [selectedMonth, setSelectedMonth] = useState(null)   // для monthly

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Сброс фильтров при смене таба
  const handleTabChange = (key) => {
    setActiveTab(key)
    setDateRange([null, null])
    setSelectedMonth(null)
  }

  const digests = {
    daily: [
      {
        id: 1,
        period: '5 июня 2026',
        date: '2026-06-05',
        count: 12,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ'],
        topNews: [
          { id: 101, title: 'Россия и Китай укрепляют сотрудничество в Арктике', summary: 'Подписано соглашение о развитии Северного морского пути и совместных научных проектах в области изучения вечной мерзлоты.', tags: ['Политика', 'Арктика'] },
          { id: 102, title: 'Новая арктическая экспедиция стартовала из Мурманска', summary: 'Учёные из России, Китая и Индии отправились исследовать изменения климата. Экспедиция продлится три месяца.', tags: ['Наука', 'Климат'] },
          { id: 103, title: 'Новые экологические стандарты для арктических регионов', summary: 'Минприроды ужесточает требования к промышленным предприятиям, работающим в Арктической зоне.', tags: ['Экология'] },
        ]
      },
      {
        id: 2,
        period: '4 июня 2026',
        date: '2026-06-04',
        count: 8,
        sources: ['ТАСС', 'Интерфакс'],
        topNews: [
          { id: 201, title: 'Запущена новая полярная станция на Шпицбергене', summary: 'Российские учёные открыли новую исследовательскую базу для мониторинга климатических изменений в высоких широтах.', tags: ['Инфраструктура', 'Наука'] },
          { id: 202, title: 'Учёные завершили исследование вечной мерзлоты', summary: 'Результаты трёхлетнего исследования указывают на ускоренное таяние грунта в Сибири и северных регионах России.', tags: ['Наука', 'Климат'] },
        ]
      },
      {
        id: 3,
        period: '3 июня 2026',
        date: '2026-06-03',
        count: 15,
        sources: ['РИА Новости', 'Наука и жизнь'],
        topNews: [
          { id: 301, title: 'Учёные зафиксировали рекордное таяние льдов', summary: 'Температура в Арктике побила 100-летний максимум. Площадь морского льда сократилась до исторического минимума для этого времени года.', tags: ['Климат', 'Арктика'] },
          { id: 302, title: 'Встреча глав арктических регионов', summary: 'На совещании обсудили вопросы инфраструктурного развития, экологической безопасности и привлечения инвестиций.', tags: ['Политика'] },
          { id: 303, title: 'Новые данные о вечной мерзлоте', summary: 'Опубликованы результаты масштабного мониторинга состояния грунта в арктических регионах за последние пять лет.', tags: ['Наука'] },
        ]
      },
      {
        id: 4,
        period: '2 июня 2026',
        date: '2026-06-02',
        count: 10,
        sources: ['Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 401, title: 'Новые портовые терминалы на Севморпути', summary: 'Объявлено о строительстве трёх новых терминалов для обработки грузов на ключевых участках Северного морского пути.', tags: ['Экономика', 'Инфраструктура'] },
          { id: 402, title: 'Инвестиции в арктические проекты', summary: 'Общий объём заявленных вложений в развитие арктической инфраструктуры превысил 500 миллиардов рублей.', tags: ['Экономика'] },
        ]
      },
      {
        id: 5,
        period: '1 июня 2026',
        date: '2026-06-01',
        count: 7,
        sources: ['ТАСС'],
        topNews: [
          { id: 501, title: 'Первые караваны судов отправились по Севморпути', summary: 'Стартовала летняя навигационная кампания. Первые конвои взяли курс на восток в сопровождении атомных ледоколов.', tags: ['Инфраструктура', 'Судоходство'] },
        ]
      },
    ],
    weekly: [
      {
        id: 1,
        period: '1–7 июня 2026',
        date: '2026-06-01/2026-06-07',
        count: 45,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 101, title: 'Международный арктический форум в Санкт-Петербурге', summary: 'Завершился крупнейший за последние годы форум с участием 15 государств. Подписано 12 межправительственных соглашений.', tags: ['Политика', 'Арктика'] },
          { id: 102, title: 'Запуск ледокола "Арктика-2"', summary: 'На Балтийском заводе спущен на воду новый атомный ледокол проекта 22220. Судно обеспечит круглогодичную навигацию по Севморпути.', tags: ['Инфраструктура'] },
          { id: 103, title: 'Соглашение России и Китая по Севморпути', summary: 'Стороны договорились о совместном развитии инфраструктуры и синхронизации транспортных коридоров вдоль северного маршрута.', tags: ['Экономика', 'Политика'] },
        ]
      },
      {
        id: 2,
        period: '25–31 мая 2026',
        date: '2026-05-25/2026-05-31',
        count: 38,
        sources: ['ТАСС', 'РИА Новости'],
        topNews: [
          { id: 201, title: 'Новые исследования климата в Арктике', summary: 'Международная группа учёных опубликовала доклад о темпах потепления в полярной зоне. Прогнозы оказались тревожнее ожидаемых.', tags: ['Климат', 'Наука'] },
          { id: 202, title: 'Экологические инициативы в регионе', summary: 'Несколько арктических государств анонсировали совместные меры по сокращению выбросов и защите морских экосистем.', tags: ['Экология'] },
        ]
      },
      {
        id: 3,
        period: '18–24 мая 2026',
        date: '2026-05-18/2026-05-24',
        count: 42,
        sources: ['Коммерсантъ', 'Интерфакс'],
        topNews: [
          { id: 301, title: 'Визит делегации Китая в Мурманск', summary: 'Представители китайских государственных компаний осмотрели портовую инфраструктуру и провели переговоры о долгосрочном сотрудничестве.', tags: ['Политика', 'Экономика'] },
          { id: 302, title: 'Новые проекты в арктической зоне', summary: 'Правительство утвердило перечень приоритетных инвестиционных проектов для развития арктических территорий до 2030 года.', tags: ['Экономика'] },
        ]
      },
    ],
    monthly: [
      {
        id: 1,
        period: 'Май 2026',
        date: 'Май 2026',
        count: 120,
        sources: ['ТАСС', 'РИА Новости', 'Коммерсантъ', 'Интерфакс', 'Арктический совет'],
        topNews: [
          { id: 101, title: 'Итоги весенней сессии Арктического совета', summary: 'Восемь государств-членов согласовали новую дорожную карту устойчивого развития Арктики до 2035 года. Главной темой стало изменение климата.', tags: ['Политика', 'Арктика'] },
          { id: 102, title: 'Ключевые решения в области арктической политики', summary: 'Правительства арктических стран приняли скоординированные меры по регулированию судоходства и охране окружающей среды.', tags: ['Политика'] },
          { id: 103, title: 'Новые экологические нормы для Арктики', summary: 'Введены обязательные стандарты для добывающих компаний: нулевой сброс загрязняющих веществ и обязательный экологический мониторинг.', tags: ['Экология'] },
        ]
      },
      {
        id: 2,
        period: 'Апрель 2026',
        date: 'Апрель 2026',
        count: 98,
        sources: ['ТАСС', 'РИА Новости'],
        topNews: [
          { id: 201, title: 'Запуск новых программ развития Арктики', summary: 'Федеральная программа включает финансирование инфраструктуры, науки и социальной поддержки коренных народов Севера.', tags: ['Экономика'] },
          { id: 202, title: 'Международные соглашения по Арктике', summary: 'Подписан ряд двусторонних договоров о сотрудничестве в сфере освоения ресурсов и охраны морской среды.', tags: ['Политика'] },
        ]
      },
    ],
  }

  const summaryByTab = {
    daily: 'Основные события дня: ',
    weekly: 'Основные события недели: ',
    monthly: 'Основные события месяца: ',
  }

  const numberColors = ['rgb(60 127 199)', 'rgb(56 159 160)', 'rgb(60 186 133)']

  // Логика фильтрации
  const getFilteredDigests = () => {
    const all = digests[activeTab]

    if (activeTab === 'daily') {
      const [from, to] = dateRange
      if (!from || !to) return all
      return all.filter(d => dayjs(d.date).isBetween(from, to, 'day', '[]'))
    }

    if (activeTab === 'weekly') {
      const [from, to] = dateRange
      if (!from || !to) return all
      return all.filter(d => {
        const [start, end] = d.date.split('/')
        // Неделя попадает в диапазон если хоть частично пересекается
        return dayjs(start).isSameOrBefore(to, 'day') && dayjs(end).isSameOrAfter(from, 'day')
      })
    }

    if (activeTab === 'monthly') {
      if (!selectedMonth) return all
      return all.filter(d => d.period.startsWith(selectedMonth))
    }

    return all
  }

  const filteredDigests = getFilteredDigests()
  const hasFilter = (activeTab !== 'monthly' && (dateRange[0] || dateRange[1])) ||
                    (activeTab === 'monthly' && selectedMonth)

  const resetFilter = () => {
    setDateRange([null, null])
    setSelectedMonth(null)
  }

  const tabItems = [
    { key: 'daily', label: isMobile ? 'День' : 'Ежедневные', count: digests.daily.length },
    { key: 'weekly', label: isMobile ? 'Неделя' : 'Еженедельные', count: digests.weekly.length },
    { key: 'monthly', label: isMobile ? 'Месяц' : 'Ежемесячные', count: digests.monthly.length },
  ]

  const openDigest = (digestId, type) => navigate(`/digests/${type}/${digestId}`)
  const openNews = (newsId, e) => { e.stopPropagation(); navigate(`/news/${newsId}`) }

  return (
    <div>
      {/* Заголовок */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={isMobile ? 3 : 2} style={{ color: '#0A2B4E', margin: '0px 0px 15px 10px' }}>
            Архив дайджестов
          </Title>
        </div>
        {isMobile && (
          <Button icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)}>
            {tabItems.find(t => t.key === activeTab)?.label}
          </Button>
        )}
      </div>

      {/* Десктопные табы */}
      {!isMobile && (
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: 16 }}
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

      {/* Фильтр */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {activeTab !== 'monthly' ? (
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [null, null])}
            placeholder={['Дата от', 'Дата до']}
            format="DD.MM.YYYY"
            style={{ width: isMobile ? '100%' : 280 }}
          />
        ) : (
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Выберите месяц"
            allowClear
            style={{ width: isMobile ? '100%' : 200 }}
            options={MONTHS}
          />
        )}
        {hasFilter && (
          <Button
            icon={<CloseOutlined />}
            onClick={resetFilter}
            size="middle"
          >
            Сбросить
          </Button>
        )}
        {hasFilter && (
          <Text type="secondary" style={{ fontSize: 13 }}>
            Найдено: {filteredDigests.length}
          </Text>
        )}
      </div>

      {/* Мобильный Drawer */}
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
              onClick={() => { handleTabChange(item.key); setMobileMenuOpen(false) }}
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
          <Spin size="large" />
        </div>
      ) : filteredDigests.length === 0 ? (
        <Empty description="Дайджесты за выбранный период не найдены" />
      ) : (
        <Row gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}>
          {filteredDigests.map(digest => (
            <Col xs={24} sm={12} lg={8} key={digest.id}>
              <Card
                hoverable
                style={{ borderRadius: 16, height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', background: '#d9ebfa' }}
                styles={{ body: { padding: isMobile ? 16 : 20, flex: 1, display: 'flex', flexDirection: 'column' } }}
                onClick={() => openDigest(digest.id, activeTab)}
              >
                {/* Заголовок карточки: дата + кол-во новостей */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                  <Text strong style={{ fontSize: isMobile ? 14 : 16, color: '#0A2B4E', display: 'block' }}>
                    <CalendarOutlined /> За {digest.period}
                  </Text>
                  <Tag style={{ margin: 0, background: 'rgb(171 231 213)', border: '1px solid rgb(52 183 128)', color: 'rgb(37 73 70)' }}>
                    {digest.count} новостей
                  </Tag> 
                </div>


                {/* Подзаголовок по типу дайджеста */}
                <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13, display: 'block', marginBottom: 10, marginTop: 10, marginLeft: 5 }}>
                  {summaryByTab[activeTab]}
                </Text>

                {/* Топ новости */}
                {digest.topNews && digest.topNews.length > 0 && (
                  <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {digest.topNews.slice(0, 3).map((news, idx) => (
                      <div
                        key={news.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: 12,
                          borderBottom: idx < Math.min(digest.topNews.length, 3) - 1 ? '1px solid #F0F0F0' : 'none',
                          cursor: 'pointer',
                          background: 'white',
                          borderRadius: '10px'
                        }}
                        onClick={(e) => openNews(news.id, e)}
                      >
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: numberColors[idx],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 'bold',
                          color: '#fff',
                          flexShrink: 0,
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {news.tags && news.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 4, marginBottom: 4, overflow: 'hidden' }}>
                              {news.tags.map(tag => (
                                <Tag key={tag} color="#4A90E2" style={{ fontSize: 10, padding: '0 5px', lineHeight: '16px', margin: 0, flexShrink: 0 }}>
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          )}
                          <Text strong style={{ fontSize: isMobile ? 12 : 13, display: 'block', marginBottom: 4, wordBreak: 'break-word' }}>
                            {news.title}
                          </Text>
                          <Paragraph
                            type="secondary"
                            ellipsis={{ rows: 2 }}
                            style={{ fontSize: isMobile ? 11 : 12, margin: 0 }}
                          >
                            {news.summary}
                          </Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Источники */}
                <div style={{ marginBottom: 12, marginTop: 'auto' }}>
                  <Text type="secondary" style={{ fontSize: isMobile ? 10 : 11, display: 'block', marginBottom: 6 }}>
                    Источники:
                  </Text>
                  <Space wrap size={[4, 4]}>
                    {digest.sources.slice(0, 3).map(source => (
                      <Tag key={source} style={{ fontSize: isMobile ? 10 : 11, background: '#F0F4FA', border: '1px solid #C8D8F0', color: '#0A2B4E' }}>
                        {source}
                      </Tag>
                    ))}
                    {digest.sources.length > 3 && (
                      <Tag style={{ background: '#F0F4FA', border: '1px solid #C8D8F0', color: '#0A2B4E' }}>
                        +{digest.sources.length - 3}
                      </Tag>
                    )}
                  </Space>
                </div>

                {/* Кнопка */}
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  style={{ paddingLeft: 0, color: '#4A90E2' }}
                  onClick={(e) => { e.stopPropagation(); openDigest(digest.id, activeTab) }}
                >
                  Читать полностью
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