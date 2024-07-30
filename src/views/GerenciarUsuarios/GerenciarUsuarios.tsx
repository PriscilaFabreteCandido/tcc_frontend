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
import { DeleteOutlined, EditOutlined, PlusOutlined, KeyOutlined } from "@ant-design/icons";
import { PessoaType } from "../Cadastros/Pessoas";
import ApiService from "../../services/ApiService";

const { Option } = Select;

const GerenciarUsuarios = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiService: ApiService = new ApiService();

  const handleCreateOrUpdate = (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("As senhas não são iguais.");
      return;
    }
    handleCadastrar();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
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

  const getUsuarios = async () => {
    setLoading(true);
    try {
      const response: any[] = await apiService.get("usuarios");
      setUsuarios(response);
    } catch (error) {
      console.error("Erro ao obter usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsuarios();
    getPessoas();
  }, []);

  const handleCadastrar = async () => {
    try {
      await form.validateFields();
      const currentValues = form.getFieldsValue();

      const acaoToCreateOrEdit = {
        ...currentValues,
        pessoa: {
          id: currentValues.idPessoa,
        },
      };

      if (!currentValues.id) {
        await apiService.post("usuarios/create", acaoToCreateOrEdit);
        message.success("Usuário criado com sucesso");
      } else {
        await apiService.put(`usuarios/update/${currentValues.id}`, acaoToCreateOrEdit);
        message.success("Usuário editado com sucesso");
      }

      setIsModalVisible(false);
      form.resetFields();
      getUsuarios(); // Refresh the table data after creating/updating
    } catch (error) {
      message.error("Erro ao cadastrar/editar usuário:", error?.data?.result);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("As senhas não são iguais.");
      return;
    }

    try {
      await apiService.put(`usuarios/update-password/${currentUserId}`, { password: values.password });
      message.success("Senha atualizada com sucesso");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error("Erro ao atualizar senha:", error?.data?.result);
    }
  };

  const handleOpenPasswordModal = (userId: string) => {
    setCurrentUserId(userId);
    setIsPasswordModalVisible(true);
  };

  const onDelete = async (id: number) => {
    try {
      await apiService.remove(`usuarios/delete/${id}`);
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      message.success("Usuário excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "pessoa",
      key: "nome",
      render: (record: any) => record?.nome,
    },
    {
      title: "Email",
      dataIndex: "pessoa",
      key: "email",
      render: (record: any) => record?.email,
    },
    {
      title: "Usuário",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Ações",
      key: "actions",
      render: (record: any) => (
        <Space size="middle">
          <Tooltip title="Alterar Senha">
            <Button shape="circle" onClick={() => handleOpenPasswordModal(record.id)}>
              <KeyOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir este usuário?"
              onConfirm={() => onDelete(record.id)}
              okText="Sim"
              cancelText="Cancelar"
            >
              <Button shape="circle">
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
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Adicionar Usuário
      </Button>
      <Table columns={columns} dataSource={usuarios} rowKey="id" />

      <Modal
        title="Criar Usuário"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item
            name="login"
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
            name="idPessoa"
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

      <Modal
        title="Alterar Senha"
        visible={isPasswordModalVisible}
        onCancel={handlePasswordCancel}
        onOk={() => passwordForm.submit()}
      >
        <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            name="password"
            label="Nova Senha"
            rules={[{ required: true, message: "Por favor, insira a nova senha." }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirmar Nova Senha"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Por favor, confirme a nova senha." },
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
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciarUsuarios;
