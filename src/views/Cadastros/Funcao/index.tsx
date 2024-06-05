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
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post, put, remove } from "../../../api/axios";

interface FuncaoType {
  key: React.Key;
  id: number;
  nome: string;
}

// const FuncaoOptions = [
//   { id: 1, descricao: "Aluno(a) bolsista" },
//   { id: 2, descricao: "Aluno(a) voluntário" },
//   { id: 3, descricao: "Apoio técnico" },
//   { id: 4, descricao: "Colaborador(a)" },
//   { id: 5, descricao: "Coordenador(a)" },
//   { id: 6, descricao: "Instrutor(a)" },
//   { id: 7, descricao: "Extensionista" },
//   { id: 8, descricao: "Monitor(a)" },
//   { id: 9, descricao: "Organizador(a)" },
//   { id: 10, descricao: "Orientador(a)" },
//   { id: 11, descricao: "Palestrante" },
//   { id: 12, descricao: "Professor(a)" },
// ];

const Funcoes: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [funcaoToEdit, setFuncaoToEdit] = useState<FuncaoType | null>(null);
  const [funcoes, setFuncoes] = useState<FuncaoType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const showModal = () => {
    setIsOpenModal(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setFuncaoToEdit(null);
    setIsOpenModal(false);
  };

  const getFuncoes = async () => {
    setLoading(true);
    try {
      const response: FuncaoType[] = await get("funcoes");
      setFuncoes(response);
    } catch (error) {
      console.error("Erro ao obter instituições:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await remove(`funcoes/delete/${id}`);
      setFuncoes(
        funcoes.filter((instituicao) => instituicao.id !== id)
      );
      message.success("Instituição excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir instituição:", error);
    }
  };

  useEffect(() => {
    getFuncoes();
  }, []);

  const handleCadastrar = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const instituicaoToCreateOrEdit = {
        nome: values.nome,
        id: funcaoToEdit ? funcaoToEdit.id : null,
       
      };

      if (!funcaoToEdit) {
        const response = await post("funcoes/create", instituicaoToCreateOrEdit);
        setIsOpenModal(false)
        message.success("Função criada com sucesso");
        

        funcoes.concat(response)
      } else {
        const response = await put(
          `funcoes/update/${funcaoToEdit.id}`,
          instituicaoToCreateOrEdit
        );
        const updatedFuncoes = funcoes.map(turma => {
          if (turma.id === response.id) {
            return response; // Substitui a turma editada no array
          } else {
            return turma;
          }
        });
        setFuncoes(updatedFuncoes);
        setIsOpenModal(false);
        message.success("Função editada com sucesso");
      }

      handleCancel();
    } catch (error: any) {
     
    }
  };


  const columns: ColumnsType<FuncaoType> = [
    {
      title: "Nome",
      dataIndex: "nome",
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
                setFuncaoToEdit(record);
                form.setFieldsValue({
                  nome: record.nome
                });
                setIsOpenModal(true);
              }}
            >
              <EditOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir esta função?"
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
      <Table columns={columns} dataSource={funcoes} loading={loading} />

      {/* Modal */}
      <Modal
        title="Adicionar Função"
        visible={isOpenModal}
        onOk={handleCadastrar}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[
              { required: true, message: "Por favor, insira o nome da função!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Funcoes;
