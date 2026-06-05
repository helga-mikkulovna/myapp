import { useState } from 'react'
import { Table, Tag, Space, Typography, Input, Badge } from 'antd'
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title } = Typography

const SourcesPage = () => {
  const [searchText, setSearchText] = useState('')

  const sources = [
    { id: 1, name: 'ТАСС', type: 'СМИ', country: 'Россия', updateFrequency: 'Ежечасно', status: 'active', reliability: 95, lastUpdate: '2026-06-05 14:30' },
    { id: 2, name: 'РИА Новости', type: 'СМИ', country: 'Россия', updateFrequency: 'Ежечасно', status: 'active', reliability: 92, lastUpdate: '2026-06-05 14:25' },
    { id: 3, name: 'Коммерсантъ', type: 'СМИ', country: 'Россия', updateFrequency: 'Ежедневно', status: 'active', reliability: 88, lastUpdate: '2026-06-05 10:00' },
    { id: 4, name: 'Арктический совет', type: 'Официальный документ', country: 'Международный', updateFrequency: 'Еженедельно', status: 'active', reliability: 99, lastUpdate: '2026-06-04 09:00' },
    { id: 5, name: 'North News', type: 'Блог', country: 'Норвегия', updateFrequency: 'Ежедневно', status: 'inactive', reliability: 45, lastUpdate: '2026-05-30 16:20' },
  ]

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Тип', dataIndex: 'type', key: 'type', filters: [{ text: 'СМИ', value: 'СМИ' }, { text: 'Блог', value: 'Блог' }, { text: 'Официальный документ', value: 'Официальный документ' }], onFilter: (value, record) => record.type === value },
    { title: 'Страна', dataIndex: 'country', key: 'country', sorter: true },
    { title: 'Частота обновлений', dataIndex: 'updateFrequency', key: 'updateFrequency' },
    { title: 'Статус', dataIndex: 'status', key: 'status', render: (status) => (
      <Badge status={status === 'active' ? 'success' : 'error'} text={status === 'active' ? 'Активен' : 'Неактивен'} />
    )},
    { title: 'Надёжность', dataIndex: 'reliability', key: 'reliability', render: (reliability) => (
      <Tag color={reliability > 90 ? 'green' : reliability > 70 ? 'blue' : 'orange'}>{reliability}%</Tag>
    ), sorter: (a, b) => a.reliability - b.reliability },
    { title: 'Последнее обновление', dataIndex: 'lastUpdate', key: 'lastUpdate', sorter: true },
  ]

  const filteredSources = sources.filter(src => 
    src.name.toLowerCase().includes(searchText.toLowerCase()) ||
    src.country.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div>
      <Title level={2} style={{ color: '#0A2B4E' }}>📡 Отслеживаемые источники</Title>
      
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Поиск источника или страны..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Tag icon={<CheckCircleOutlined />} color="success">Всего источников: {sources.filter(s => s.status === 'active').length} активных из {sources.length}</Tag>
      </Space>

      <Table 
        columns={columns} 
        dataSource={filteredSources} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ background: 'white', borderRadius: 12 }}
      />
    </div>
  )
}

export default SourcesPage