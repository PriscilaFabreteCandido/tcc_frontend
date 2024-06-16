import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Tooltip,
  Modal,
  Form,
  message,
  Popconfirm,
  Space,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  ToolOutlined,
  ExperimentOutlined,
  SolutionOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post, put, remove } from "../../../api/axios";

export interface ActionType {
  key: React.Key;
  id: number;
  nome: string;
  icone: string; // Novo campo
}

export const iconOptions = [
  { label: "Curso", value: "BookOutlined", icon: <BookOutlined /> },
  { label: "Visita Guiada", value: "CalendarOutlined", icon: <CalendarOutlined /> },
  { label: "Projeto", value: "SolutionOutlined", icon: <SolutionOutlined /> },
  { label: "Evento", value: "TrophyOutlined", icon: <TrophyOutlined /> },
  { label: "Apoio Técnico", value: "ToolOutlined", icon: <ToolOutlined /> },
  { label: "Pesquisa", value: "ExperimentOutlined", icon: <ExperimentOutlined /> },
  { label: "Reunião", value: "TeamOutlined", icon: <TeamOutlined /> },
  { label: "Horário", value: "FieldTimeOutlined", icon: <FieldTimeOutlined /> },
  { label: "Visita", value: "HomeOutlined", icon: <HomeOutlined /> },
];

const TiposAcoes: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tipoAcaoToEdit, setTipoAcaoToEdit] = useState<ActionType | null>(null);
  const [tiposAcoes, setTiposAcoes] = useState<ActionType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const showModal = () => {
    setIsOpenModal(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setTipoAcaoToEdit(null);
    setIsOpenModal(false);
  };

  const getTiposAcoes = async () => {
    setLoading(true);
    try {
      const response: ActionType[] = await get("tipoAcoes");
      setTiposAcoes(response);
    } catch (error) {
      console.error("Erro ao obter tipos de ações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTiposAcoes();
  }, []);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const tipoAcaoData = {
        nome: values.nome,
        icone: values.icone, // Novo campo
        id: tipoAcaoToEdit ? tipoAcaoToEdit.id : null,
      };

      if (!tipoAcaoToEdit) {
        const response = await post("tipoAcoes/create", tipoAcaoData);
        message.success("Tipo de ação criado com sucesso");
        setTiposAcoes([...tiposAcoes, response]); // Adiciona o novo tipo de ação ao array
      } else {
        const response = await put(`tipoAcoes/update/${tipoAcaoToEdit.id}`, tipoAcaoData);
        message.success("Tipo de ação editado com sucesso");
        const updatedTiposAcoes = tiposAcoes.map(tipoAcao => {
          if (tipoAcao.id === response.id) {
            return response; // Substitui o tipo de ação editado no array
          } else {
            return tipoAcao;
          }
        });
        setTiposAcoes(updatedTiposAcoes);
      }

      handleCancel();
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await remove(`tipoAcoes/delete/${id}`);
      getTiposAcoes();
      message.success("Tipo de ação excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir tipo de ação:", error);
    }
  };

  const columns: ColumnsType<ActionType> = [
    {
      title: "Nome",
      dataIndex: "nome",
    },
    {
      title: "Ícone",
      dataIndex: "icone",
      render: (text) => {
        const icon = iconOptions.find((option) => option.value === text)?.icon;
        return icon ? <span>{icon}</span> : null;
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button
              className="ifes-btn-warning"
              shape="circle"
              onClick={() => {
                setTipoAcaoToEdit(record);
                form.setFieldsValue({
                  nome: record.nome,
                  icone: record.icone, // Novo campo
                });
                setIsOpenModal(true);
              }}
            >
              <EditOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir este tipo de ação?"
              onConfirm={() => onDelete(record.id)}
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
    <>
      {/* Header */}
      <CardFooter>
        <div className="flex justify-content-between">
          {/* Filtros */}
          <div className="flex filtros-card"></div>

          <div>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Tabela */}
      <Table columns={columns} dataSource={tiposAcoes} loading={loading} />

      {/* Modal */}
      <Modal
        title="Adicionar Tipo de Ação"
        visible={isOpenModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[
              { required: true, message: "Por favor, insira o nome do tipo de ação!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="icone"
            label="Ícone"
            rules={[
              { required: true, message: "Por favor, selecione um ícone para o tipo de ação!" },
            ]}
          >
            <Select
              options={iconOptions.map((option) => ({
                label: (
                  <span>
                    {option.icon} {option.label}
                  </span>
                ),
                value: option.value,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TiposAcoes;
