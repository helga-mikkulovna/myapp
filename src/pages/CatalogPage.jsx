import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Row, Col, Card, Button, Tag, Space, Pagination, Input, 
  DatePicker, Select, Checkbox, Typography, Empty, Drawer, 
  Slider, Spin, message, Badge
} from 'antd'
import { 
  FilterOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  SearchOutlined,
  ClearOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { directusApi } from '../api/directusClient'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const CATEGORIES = [
  { key: 'ecology', label: '🌿 Экология', color: '#2E8B57' },
  { key: 'economy', label: '💰 Экономика', color: '#4A90E2' },
  { key: 'infrastructure', label: '🏗️ Инфраструктура', color: '#0A2B4E' },
  { key: 'science', label: '🔬 Наука', color: '#00A8A8' },
  { key: 'international', label: '🌍 Международное сотрудничество', color: '#4A90E2' },
  { key: 'indigenous', label: '👥 Коренные народы', color: '#2E8B57' },
  { key: 'climate', label: '🌡️ Климат', color: '#00A8A8' },
]

const SOURCES_LIST = [
  { label: 'ТАСС', value: 'tass' },
  { label: 'РИА Новости', value: 'ria' },
  { label: 'Коммерсантъ', value: 'kommersant' },
  { label: 'Интерфакс', value: 'interfax' },
  { label: 'Арктический совет', value: 'arctic-council' },
  { label: 'High North News', value: 'high-north' },
]

const CatalogPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    categories: [],
    dateRange: null,
    sources: [],
    search: '',
    page: 1,
  })

  // Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Запрос новостей
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['catalog-news', filters],
    queryFn: async () => {
      const params = {
        sort: '-date',
        limit: 20,
        page: filters.page,
        fields: 'id,title,description,date,source,category,image_url',
      }
      
      const filterRules = []
      
      if (filters.categories.length) {
        filterRules.push({ category: { _in: filters.categories } })
      }
      if (filters.sources.length) {
        filterRules.push({ source: { _in: filters.sources } })
      }
      if (filters.search) {
        filterRules.push({ title: { _contains: filters.search } })
      }
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        filterRules.push({ 
          date: { 
            _between: [
              filters.dateRange[0].format('YYYY-MM-DD'), 
              filters.dateRange[1].format('YYYY-MM-DD')
            ] 
          } 
        })
      }
      
      if (filterRules.length > 0) {
        params.filter = { _and: filterRules }
      }
      
      try {
        const { data } = await directusApi.get('/news', { params })
        return data
      } catch (error) {
        console.error('API Error:', error)
        // Возвращаем демо-данные, если API не доступен
        return {
          data: [
            {
              id: 1,
              title: 'В Арктике началась новая экспедиция',
              description: 'Учёные отправились изучать изменение климата в регионе...',
              date: '2026-06-05',
              source: 'ТАСС',
              category: 'science',
              image_url: null
            },
            {
              id: 2,
              title: 'Россия и Китай договорились о сотрудничестве в Арктике',
              description: 'Подписано соглашение о развитии Северного морского пути...',
              date: '2026-06-04',
              source: 'РИА Новости',
              category: 'international',
              image_url: null
            },
          ],
          meta: { total_count: 2 }
        }
      }
    },
  })

  const handleCategoryToggle = (categoryKey) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryKey)
        ? prev.categories.filter(c => c !== categoryKey)
        : [...prev.categories, categoryKey],
      page: 1
    }))
  }

  const resetFilters = () => {
    setFilters({
      categories: [],
      dateRange: null,
      sources: [],
      search: '',
      page: 1,
    })
    message.success('Фильтры сброшены')
  }

  // Компонент фильтров (общий для десктопа и мобильной модалки)
  const FiltersContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Поиск */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>🔍 Поиск</Text>
        <Input.Search 
          placeholder="По заголовкам и тексту..."
          allowClear
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          size={isMobile ? 'middle' : 'large'}
        />
      </div>

      {/* 7 тематических кнопок */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>📂 Темы</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map(cat => (
            <Button
              key={cat.key}
              size={isMobile ? 'small' : 'middle'}
              type={filters.categories.includes(cat.key) ? 'primary' : 'default'}
              onClick={() => handleCategoryToggle(cat.key)}
              style={{
                backgroundColor: filters.categories.includes(cat.key) ? cat.color : undefined,
                borderColor: cat.color,
                color: filters.categories.includes(cat.key) ? 'white' : cat.color,
              }}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Диапазон дат */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>📅 Период</Text>
        <RangePicker 
          style={{ width: '100%' }}
          size={isMobile ? 'middle' : 'large'}
          value={filters.dateRange}
          onChange={(dates) => setFilters({ ...filters, dateRange: dates, page: 1 })}
          placeholder={['Дата от', 'Дата до']}
        />
      </div>

      {/* Источники */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>📡 Источники</Text>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          size={isMobile ? 'middle' : 'large'}
          placeholder="Выберите источники"
          value={filters.sources}
          onChange={(values) => setFilters({ ...filters, sources: values, page: 1 })}
          options={SOURCES_LIST}
          allowClear
          maxTagCount={isMobile ? 'responsive' : 3}
        />
      </div>

      {/* Кнопка сброса */}
      <Button 
        icon={<ClearOutlined />} 
        onClick={resetFilters}
        size={isMobile ? 'middle' : 'large'}
        danger
      >
        Сбросить все фильтры
      </Button>
    </div>
  )

  // Получаем цвет категории
  const getCategoryColor = (categoryKey) => {
    const cat = CATEGORIES.find(c => c.key === categoryKey)
    return cat?.color || '#4A90E2'
  }

  const getCategoryLabel = (categoryKey) => {
    const cat = CATEGORIES.find(c => c.key === categoryKey)
    return cat?.label || categoryKey
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Title level={isMobile ? 3 : 2} style={{ color: '#0A2B4E', margin: 0 }}>
          📰 Каталог новостей
        </Title>
        {!isMobile && (
          <Badge count={filters.categories.length + filters.sources.length + (filters.search ? 1 : 0) + (filters.dateRange ? 1 : 0)}>
            <Button icon={<FilterOutlined />} onClick={() => setFilterModalOpen(true)}>
              Активные фильтры
            </Button>
          </Badge>
        )}
      </div>
      
      <Row gutter={[24, 24]}>
        {/* Панель фильтров - на десктопе всегда видна, на мобильных в модалке */}
        {!isMobile ? (
          <Col xs={24} md={6}>
            <Card 
              title="Фильтры" 
              style={{ borderRadius: 12, position: 'sticky', top: 90 }}
              extra={
                <Button type="text" size="small" onClick={resetFilters}>
                  Сбросить
                </Button>
              }
            >
              <FiltersContent />
            </Card>
          </Col>
        ) : (
          <>
            <Col xs={24}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Input.Search 
                  placeholder="Поиск..."
                  allowClear
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  style={{ flex: 1 }}
                />
                <Badge count={filters.categories.length + filters.sources.length + (filters.dateRange ? 1 : 0)}>
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={() => setFilterModalOpen(true)}
                  >
                    Фильтры
                  </Button>
                </Badge>
              </Space>
            </Col>
            
            <Drawer
              title="Фильтры"
              placement="bottom"
              onClose={() => setFilterModalOpen(false)}
              open={filterModalOpen}
              height="85%"
              closable
            >
              <FiltersContent />
            </Drawer>
          </>
        )}

        {/* Результаты */}
        <Col xs={24} md={18}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 8
          }}>
            <Text type="secondary">
              {isLoading || isFetching ? (
                <Spin size="small" /> 
              ) : (
                <>📊 Найдено: <strong>{data?.meta?.total_count || 0}</strong> новостей</>
              )}
            </Text>
            
            {/* Отображаем активные фильтры в виде тегов */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filters.categories.map(cat => (
                <Tag 
                  key={cat} 
                  closable 
                  onClose={() => handleCategoryToggle(cat)}
                  color={getCategoryColor(cat)}
                  style={{ cursor: 'pointer' }}
                >
                  {getCategoryLabel(cat)}
                </Tag>
              ))}
              {filters.sources.map(src => (
                <Tag 
                  key={src} 
                  closable 
                  onClose={() => setFilters({ ...filters, sources: filters.sources.filter(s => s !== src), page: 1 })}
                  color="blue"
                >
                  {SOURCES_LIST.find(s => s.value === src)?.label || src}
                </Tag>
              ))}
              {filters.dateRange && filters.dateRange[0] && (
                <Tag 
                  closable 
                  onClose={() => setFilters({ ...filters, dateRange: null, page: 1 })}
                  color="cyan"
                >
                  {filters.dateRange[0].format('DD.MM.YY')} — {filters.dateRange[1]?.format('DD.MM.YY')}
                </Tag>
              )}
              {filters.search && (
                <Tag 
                  closable 
                  onClose={() => setFilters({ ...filters, search: '', page: 1 })}
                  color="geekblue"
                >
                  Поиск: {filters.search}
                </Tag>
              )}
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" tip="Загрузка новостей..." />
            </div>
          ) : data?.data?.length === 0 ? (
            <Empty 
              description="Новостей не найдено"
              style={{ marginTop: 50 }}
            >
              <Button onClick={resetFilters}>Сбросить фильтры</Button>
            </Empty>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {data?.data?.map(item => (
                  <Card 
                    key={item.id} 
                    hoverable
                    style={{ borderRadius: 12 }}
                    bodyStyle={{ padding: isMobile ? 16 : 20 }}
                  >
                    <Row gutter={[16, 16]}>
                      {item.image_url && (
                        <Col xs={24} sm={6}>
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            style={{ 
                              width: '100%', 
                              borderRadius: 8, 
                              height: isMobile ? 150 : 120, 
                              objectFit: 'cover' 
                            }}
                          />
                        </Col>
                      )}
                      <Col xs={24} sm={item.image_url ? 18 : 24}>
                        <Space wrap style={{ marginBottom: 8 }}>
                          {item.category && (
                            <Tag color={getCategoryColor(item.category)}>
                              {getCategoryLabel(item.category)}
                            </Tag>
                          )}
                          <Tag icon={<CalendarOutlined />} color="default">
                            {item.date}
                          </Tag>
                          <Tag icon={<EnvironmentOutlined />} color="default">
                            {item.source}
                          </Tag>
                        </Space>
                        <Title level={isMobile ? 5 : 4} style={{ margin: '8px 0' }}>
                          {item.title}
                        </Title>
                        <Text type="secondary">
                          {item.description?.substring(0, isMobile ? 100 : 150)}
                          {item.description?.length > (isMobile ? 100 : 150) && '...'}
                        </Text>
                        <div style={{ marginTop: 12 }}>
                          <Button 
  type="link" 
  style={{ paddingLeft: 0, color: '#0645AD' }}
  icon={<EyeOutlined />}
  onClick={() => navigate(`/news/${item.id}`)}
>
  Читать далее
</Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>

              {data?.meta?.total_count > 20 && (
                <Pagination
                  current={filters.page}
                  total={data.meta.total_count}
                  pageSize={20}
                  onChange={(page) => setFilters({ ...filters, page })}
                  style={{ marginTop: 32, textAlign: 'center' }}
                  size={isMobile ? 'small' : 'default'}
                  showSizeChanger={!isMobile}
                  showTotal={(total) => `Всего ${total} новостей`}
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default CatalogPage