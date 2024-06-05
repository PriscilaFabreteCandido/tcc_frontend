
import { Form, Input, DatePicker, Select, Button, Space, Tooltip } from 'antd';
import { DeleteOutlined, InfoOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function CadastrarEquipesExecucao() {
  const onFinish = (values: any) => {
    console.log('Valores do formulário:', values);
    // Adicione a lógica para enviar os dados ou realizar ações necessárias
  };

  // Simule algumas opções de equipe de execução
  const equipeExecucaoOptions = [
    { id: 1, nome: 'Membro 1' },
    { id: 2, nome: 'Membro 2' },
    { id: 3, nome: 'Membro 3' },
  ];

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      {/* Informações Gerais */}
      <Form.Item
        label="Nome"
        name="nome"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="CPF"
        name="cpf"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Data de Nascimento"
        name="dtNascimento"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Equipe de Execução"
        name="equipeExecucao"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Select
          mode="multiple"
          placeholder="Selecione os membros da equipe"
          style={{ width: '100%' }}
        >
          {equipeExecucaoOptions?.map((membro) => (
            <Option key={membro.id} value={membro.nome}>
              {membro.nome}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Data de Saída"
        name="dtSaida"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Curso"
        name="curso"
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input />
      </Form.Item>

      {/* Ações */}
      <Form.Item label="Ações" wrapperCol={{ span: 24 }}>
        <Space size="middle">
          <Tooltip title="Excluir">
            <Button
              className="ifes-btn-danger"
              shape="circle"
              onClick={() => {}}
            >
              <DeleteOutlined className="ifes-icon" />
            </Button>
          </Tooltip>

          <Tooltip title="Detalhes">
            <Button
              className="ifes-btn-info"
              shape="circle"
              onClick={() => {}}
            >
              <InfoOutlined className="ifes-icon" />
            </Button>
          </Tooltip>

          <Tooltip title="Ativar/Desativar">
            <Button
              className="ifes-btn-success"
              shape="circle"
              onClick={() => {}}
            >
              <CheckCircleOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
        </Space>
      </Form.Item>

      {/* Botão de Envio */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};


