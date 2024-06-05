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
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post, put, remove } from "../../../api/axios";
import { niveisEscolaridade } from "../../../data/niveisdeescolaridade";

interface CursoType {
  key: React.Key;
  id: number;
  nome: string;
  nivel: string;
}

const Cursos: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [cursoToEdit, setCursoToEdit] = useState<CursoType | null>(null);
  const [cursos, setCursos] = useState<CursoType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const showModal = () => {
    setIsOpenModal(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setCursoToEdit(null);
    setIsOpenModal(false);
  };

  const getCursos = async () => {
    setLoading(true);
    try {
      const response: CursoType[] = await get("cursos");
      setCursos(response);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await remove(`cursos/delete/${id}`);
      setCursos(cursos.filter((curso) => curso.id !== id));
      message.success("Curso excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  useEffect(() => {
    getCursos();
  }, []);

  const handleCadastrar = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      const cursoToCreateOrEdit = {
        nome: values.nome,
        nivel: values.nivel,
        id: cursoToEdit ? cursoToEdit.id : null,
      };

      if (!cursoToEdit) {
        const resp = await post("cursos/create", cursoToCreateOrEdit);
        setIsOpenModal(false);
        message.success("Curso criado com sucesso");
        setCursos(cursos.concat(resp))
      } else {
        const resp = await put(
          `cursos/update/${cursoToEdit.id}`,
          cursoToCreateOrEdit
        );
        setIsOpenModal(false);
        message.success("Curso editado com sucesso");
        const updatedCursos = cursos.map((curso) =>
          curso.id === cursoToEdit.id ? resp : curso
        );
        setCursos(updatedCursos);
      }

      handleCancel();
    } catch (error: any) {
      console.error("Erro ao cadastrar/editar curso:", error);
    }
  };

  const columns: ColumnsType<CursoType> = [
    {
      title: "Nome",
      dataIndex: "nome",
    },
    {
      title: "Nível de Escolaridade",
      dataIndex: "nivel",
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
                setCursoToEdit(record);
                form.setFieldsValue({
                  nome: record.nome,
                  nivel: record.nivel,
                });
                setIsOpenModal(true);
              }}
            >
              <EditOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir este curso?"
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
      <Table columns={columns} dataSource={cursos} loading={loading} />

      {/* Modal */}
      <Modal
        title="Adicionar Curso"
        visible={isOpenModal}
        onOk={handleCadastrar}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[
              { required: true, message: "Por favor, insira o nome do curso!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nivel"
            label="Nível de escolaridade"
            rules={[
              {
                required: true,
                message: "Por favor, selecione a instituição da pessoa!",
              },
            ]}
          >
            <Select>
              {niveisEscolaridade.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Cursos;
