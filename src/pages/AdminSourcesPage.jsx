import { useState, useEffect } from 'react'
import { 
  Table, Button, Space, Modal, Form, Input, Select, Tag, 
  Popconfirm, message, Switch, Card, Typography, Row, Col,
  Statistic, Badge, Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

// Начальные демо-данные
const INITIAL_SOURCES = [
  { 
    id: 1, 
    name: 'ТАСС', 
    type: 'СМИ', 
    country: 'Россия', 
    url: 'https://tass.ru/rss/arctic',
    updateFrequency: 'Ежечасно', 
    status: 'active', 
    reliability: 95, 
    relevance: true,
    lastParse: '2026-06-05 14:30',
    itemsCount: 124
  },
  { 
    id: 2, 
    name: 'РИА Новости', 
    type: 'СМИ', 
    country: 'Россия', 
    url: 'https://ria.ru/arcitc/',
    updateFrequency: 'Ежечасно', 
    status: 'active', 
    reliability: 92, 
    relevance: true,
    lastParse: '2026-06-05 14:25',
    itemsCount: 98
  },
  { 
    id: 3, 
    name: 'Коммерсантъ', 
    type: 'СМИ', 
    country: 'Россия', 
    url: 'https://www.kommersant.ru/rubric/9',
    updateFrequency: 'Ежедневно', 
    status: 'active', 
    reliability: 88, 
    relevance: true,
    lastParse: '2026-06-05 10:00',
    itemsCount: 76
  },
  { 
    id: 4, 
    name: 'Арктический совет', 
    type: 'Официальный документ', 
    country: 'Международный', 
    url: 'https://arctic-council.org/news/',
    updateFrequency: 'Еженедельно', 
    status: 'active', 
    reliability: 99, 
    relevance: true,
    lastParse: '2026-06-04 09:00',
    itemsCount: 52
  },
  { 
    id: 5, 
    name: 'North News', 
    type: 'Блог', 
    country: 'Норвегия', 
    url: 'https://northnews.no',
    updateFrequency: 'Ежедневно', 
    status: 'inactive', 
    reliability: 45, 
    relevance: false,
    lastParse: '2026-05-30 16:20',
    itemsCount: 0
  },
  { 
    id: 6, 
    name: 'High North News', 
    type: 'СМИ', 
    country: 'Норвегия', 
    url: 'https://www.highnorthnews.com',
    updateFrequency: 'Ежедневно', 
    status: 'active', 
    reliability: 78, 
    relevance: true,
    lastParse: '2026-06-05 12:00',
    itemsCount: 45
  },
]

const AdminSourcesPage = () => {
  const [sources, setSources] = useState(INITIAL_SOURCES)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSource, setEditingSource] = useState(null)
  const [form] = Form.useForm()

  // Статистика
  const activeCount = sources.filter(s => s.status === 'active').length
  const relevantCount = sources.filter(s => s.relevance === true).length
  const inactiveCount = sources.filter(s => s.status === 'inactive').length
  const avgReliability = Math.round(sources.reduce((sum, s) => sum + s.reliability, 0) / sources.length)

  // Добавление/редактирование источника
  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingSource) {
        // Редактирование
        setSources(prev => prev.map(s => 
          s.id === editingSource.id 
            ? { ...s, ...values, id: s.id }
            : s
        ))
        message.success('Источник обновлён')
      } else {
        // Добавление
        const newSource = {
          ...values,
          id: Date.now(),
          lastParse: '—',
          itemsCount: 0,
          reliability: 0,
        }
        setSources(prev => [...prev, newSource])
        message.success('Источник добавлен')
      }
      setModalVisible(false)
      setEditingSource(null)
      form.resetFields()
    })
  }

  // Удаление источника
  const handleDelete = (id) => {
    setSources(prev => prev.filter(s => s.id !== id))
    message.success('Источник удалён')
  }

  // Переключение релевантности
  const toggleRelevance = (id, currentRelevance) => {
    setSources(prev => prev.map(s => 
      s.id === id ? { ...s, relevance: !currentRelevance } : s
    ))
    message.success(`Источник ${!currentRelevance ? 'отмечен как релевантный' : 'скрыт из публичного списка'}`)
  }

  // Переключение статуса
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    setSources(prev => prev.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ))
    message.success(`Статус изменён на ${newStatus === 'active' ? 'активен' : 'неактивен'}`)
  }

  // Колонки таблицы
  const columns = [
    { 
      title: 'Название', 
      dataIndex: 'name', 
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          {text}
          {!record.relevance && <Tag icon={<EyeInvisibleOutlined />} color="orange">Скрыт</Tag>}
        </Space>
      )
    },
    { 
      title: 'Тип', 
      dataIndex: 'type', 
      key: 'type',
      filters: [
        { text: 'СМИ', value: 'СМИ' },
        { text: 'Блог', value: 'Блог' },
        { text: 'Официальный документ', value: 'Официальный документ' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    { title: 'Страна', dataIndex: 'country', key: 'country', sorter: true },
    { 
      title: 'URL / RSS', 
      dataIndex: 'url', 
      key: 'url',
      ellipsis: true,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      )
    },
    { 
      title: 'Частота', 
      dataIndex: 'updateFrequency', 
      key: 'updateFrequency',
    },
    { 
      title: 'Статус', 
      dataIndex: 'status', 
      key: 'status',
      render: (status, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge status={status === 'active' ? 'success' : 'error'} />
          <Switch 
            size="small"
            checked={status === 'active'}
            onChange={() => toggleStatus(record.id, status)}
          />
        </div>
      )
    },
    { 
      title: 'Надёжность', 
      dataIndex: 'reliability', 
      key: 'reliability',
      sorter: (a, b) => a.reliability - b.reliability,
      render: (reliability) => (
        <Tag color={reliability > 90 ? 'green' : reliability > 70 ? 'blue' : 'orange'}>
          {reliability}%
        </Tag>
      )
    },
    { 
      title: 'Релевантен', 
      dataIndex: 'relevance', 
      key: 'relevance',
      render: (relevance, record) => (
        <Tooltip title={relevance ? 'Показывать на сайте' : 'Скрыть с сайта'}>
          <Button 
            icon={relevance ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            type={relevance ? 'primary' : 'default'}
            size="small"
            onClick={() => toggleRelevance(record.id, relevance)}
          />
        </Tooltip>
      )
    },
    { 
      title: 'Последний парсинг', 
      dataIndex: 'lastParse', 
      key: 'lastParse',
      sorter: (a, b) => new Date(a.lastParse) - new Date(b.lastParse),
    },
    { 
      title: 'Действия', 
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setEditingSource(record)
              form.setFieldsValue(record)
              setModalVisible(true)
            }}
          />
          <Popconfirm
            title="Удалить источник?"
            description="Новости из этого источника будут удалены"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: '#0A2B4E' }}>
          📡 Управление источниками
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSource(null)
            form.resetFields()
            setModalVisible(true)
          }}
          style={{ background: '#2E8B57' }}
        >
          Добавить источник
        </Button>
      </div>

      {/* Статистика */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic 
              title="Всего источников" 
              value={sources.length} 
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic 
              title="Активные" 
              value={activeCount} 
              suffix={`/ ${sources.length}`}
              styles={{ content: { color: '#2E8B57' } }}  // вместо valueStyle
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic 
              title="Неактивные" 
              value={inactiveCount} 
              styles={{ content: { color: '#2E8B57' } }}  // вместо valueStyle
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic 
              title="Релевантных" 
              value={relevantCount} 
              suffix={`/ ${sources.length}`}
              styles={{ content: { color: '#2E8B57' } }}  // вместо valueStyle
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Таблица источников */}
      <Card style={{ borderRadius: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              message.loading('Обновление статусов...', 0.5)
              setTimeout(() => message.success('Статусы обновлены'), 500)
            }}
          >
            Проверить все источники
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={sources} 
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `Всего ${total} источников` }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Модальное окно добавления/редактирования */}
      <Modal
        title={editingSource ? 'Редактировать источник' : 'Добавить источник'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          setEditingSource(null)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Например: ТАСС" />
          </Form.Item>
          
          <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
            <Select placeholder="Выберите тип">
              <Option value="СМИ">СМИ</Option>
              <Option value="Блог">Блог</Option>
              <Option value="Официальный документ">Официальный документ</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="country" label="Страна" rules={[{ required: true }]}>
            <Input placeholder="Например: Россия, Норвегия, Международный" />
          </Form.Item>
          
          <Form.Item name="url" label="URL / RSS-лента" rules={[{ required: true, type: 'url', message: 'Введите корректный URL' }]}>
            <Input placeholder="https://example.com/rss" />
          </Form.Item>
          
          <Form.Item name="updateFrequency" label="Частота обновлений" rules={[{ required: true }]}>
            <Select placeholder="Выберите частоту">
              <Option value="Ежечасно">Ежечасно</Option>
              <Option value="Каждые 6 часов">Каждые 6 часов</Option>
              <Option value="Ежедневно">Ежедневно</Option>
              <Option value="Еженедельно">Еженедельно</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="Статус" initialValue="active">
            <Select>
              <Option value="active">Активен</Option>
              <Option value="inactive">Неактивен</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="relevance" label="Релевантен" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Да" unCheckedChildren="Нет" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminSourcesPage