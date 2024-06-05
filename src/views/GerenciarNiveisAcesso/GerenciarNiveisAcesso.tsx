import  { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const mockAccessLevels = [
  { id: 1, name: 'Admin', functions: [1, 2], people: [1, 2] },
  { id: 2, name: 'User', functions: [1], people: [3] },
];

const mockFunctions = [
  { id: 1, name: 'Create' },
  { id: 2, name: 'Edit' },
  { id: 3, name: 'Delete' },
];

const mockPeople = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
];

const GerenciarNiveisAcesso = () => {
  const [accessLevels, setAccessLevels] = useState(mockAccessLevels);
  const [functions] = useState(mockFunctions);
  const [people] = useState(mockPeople);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateOrUpdate = (values:any) => {
    if (selectedAccessLevel) {
      const updatedAccessLevels = accessLevels.map((level) =>
        level.id === selectedAccessLevel.id ? { ...level, ...values } : level
      );
      setAccessLevels(updatedAccessLevels);
      message.success('Nível de acesso atualizado com sucesso.');
    } else {
      const newAccessLevel = {
        id: accessLevels.length + 1,
        ...values,
      };
      setAccessLevels([...accessLevels, newAccessLevel]);
      message.success('Nível de acesso criado com sucesso.');
    }
    setIsModalVisible(false);
  };

  // const handleEdit = (record) => {
  //   setSelectedAccessLevel(record);
  //   form.setFieldsValue(record);
  //   setIsModalVisible(true);
  // };

  // const handleDelete = (id) => {
  //   const updatedAccessLevels = accessLevels.filter((level) => level.id !== id);
  //   setAccessLevels(updatedAccessLevels);
  //   message.success('Nível de acesso excluído com sucesso.');
  // };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
        title: "Ações",
        key: "actions",
        render: () => (
          <Space size="middle">
            <Tooltip title="Editar">
              <Button
                className="ifes-btn-warning"
                shape="circle"
                
                onClick={() => {
                 
                  
                }}
              >
                <EditOutlined className="ifes-icon" />
              </Button>
            </Tooltip>
            <Tooltip title="Excluir">
              <Popconfirm
                title="Tem certeza que deseja excluir este curso?"
                onConfirm={() => {}}
                okText="Sim"
                cancelText="Cancelar"
              >
                <Button
                  className="ifes-btn-danger"
                  shape="circle"
                  onClick={() => {}}
                >
                  <DeleteOutlined className="ifes-icon" />
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{marginBottom: "1rem"}}
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedAccessLevel(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Adicionar Nível de Acesso
      </Button>
      <Table columns={columns} dataSource={accessLevels} rowKey="id" />

      <Modal
        title={selectedAccessLevel ? 'Editar Nível de Acesso' : 'Criar Nível de Acesso'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do nível de acesso.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="functions"
            label="Funcionalidades"
            rules={[{ required: true, message: 'Por favor, selecione as funcionalidades.' }]}
          >
            <Select mode="multiple" placeholder="Selecione funcionalidades">
              {functions.map((func) => (
                <Option key={func.id} value={func.id}>
                  {func.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="people"
            label="Pessoas"
            rules={[{ required: true, message: 'Por favor, selecione as pessoas.' }]}
          >
            <Select mode="multiple" placeholder="Selecione pessoas">
              {people.map((person) => (
                <Option key={person.id} value={person.id}>
                  {person.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciarNiveisAcesso;
