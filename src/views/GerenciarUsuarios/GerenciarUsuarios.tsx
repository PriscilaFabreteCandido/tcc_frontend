import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PessoaType } from "../Cadastros/Pessoas";
import ApiService from "../../services/ApiService";


const { Option } = Select;

const GerenciarUsuarios = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiService: ApiService = new ApiService();
  
  const handleCreateOrUpdate = (values:any) => {
    if (values.password !== values.confirmPassword) {
      message.error("As senhas não são iguais.");
      return;
    }

    message.success("Usuário criado ou atualizado com sucesso.");
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const getPessoas = async () => {
    setLoading(true);
    try {
      const response: PessoaType[] = await apiService.get("pessoas");
      setPessoas(response);
    } catch (error) {
      console.error("Erro ao obter pessoas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPessoas();
  }, []);

  const columns = [
    {
      title: "Usuário",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ações",
      key: "actions",
      render: () => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button shape="circle" onClick={() => {}}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir este usuário?"
              onConfirm={() => {}}
              okText="Sim"
              cancelText="Cancelar"
            >
              <Button shape="circle" onClick={() => {}}>
                <DeleteOutlined />
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
        style={{ marginBottom: "1rem" }}
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Adicionar Usuário
      </Button>
      <Table columns={columns} dataSource={[]} rowKey="id" />

      <Modal
        title="Criar Usuário"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item
            name="username"
            label="Usuário"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome de usuário.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: "Por favor, insira a senha." }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Senha"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Por favor, confirme a senha." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não são iguais."));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="person"
            label="Pessoa"
            rules={[
              { required: true, message: "Por favor, selecione uma pessoa." },
            ]}
          >
            <Select placeholder="Selecione uma pessoa" loading={loading}>
              {pessoas.map((person) => (
                <Option key={person.id} value={person.id}>
                  {person.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciarUsuarios;
