import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Tooltip,
  Form,
  message,
  Popconfirm,
  Space,
  Select,
  Collapse,
} from "antd";
import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post,  remove } from "../../../api/axios";
import { useNavigate } from "react-router";
import { tipoInstituicoes } from "../../../data/tipoInstituicoes";

export interface TipoInstituicaoType {
  id: number;
  nome: string;
}
export interface InstituicaoType {
  key: React.Key;
  id: number;
  nome: string;
  endereco: string;
  bairro: string;
  rua: string;
  estado: string;
  cep: string;
  numero: string;
  descricao: string;
  email: string;
  tipoInstituicao: TipoInstituicaoType;
}

const Instituicoes: React.FC = () => {
  const [formFilter] = Form.useForm();
  const [instituicoes, setInstituicoes] = useState<InstituicaoType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const getInstituicoes = async () => {
    setLoading(true);
    try {
      const response: InstituicaoType[] = await get("instituicoes");
      setInstituicoes(response);
    } catch (error) {
      console.error("Erro ao obter instituições:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstituicoes();
  }, []);

  const onDelete = async (id: number) => {
    try {
      await remove(`instituicoes/delete/${id}`);
      setInstituicoes(
        instituicoes.filter((instituicao) => instituicao.id !== id)
      );
      message.success("Instituição excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir instituição:", error);
    }
  };

  const onFilter = async () => {
    try {
      setInstituicoes([]);
      setLoading(true);
      const values = formFilter.getFieldsValue();
      const resp = await post(`instituicoes/filter`, values);
      setInstituicoes(resp);
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<InstituicaoType> = [
    {
      title: "Nome",
      dataIndex: "nome",
    },
    {
      title: "Tipo Instituição",
      dataIndex: "tipoInstituicao",
    },
    {
      title: "Endereco",
      dataIndex: "endereco",
      render: (_, record) => (
        <div>{`${record.rua}, ${record.numero}, ${record.bairro}, ${record.estado}`}</div>
      ),
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
                navigate("/Cadastros/Instituições/Editar Instituição", {
                  state: { instituicao: record },
                });
              }}
            >
              <EditOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir esta instituição?"
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

  const items = [
    {
      key: "1",
      label: (
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="flex gap-1" style={{ alignItems: "center" }}>
            <BankOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Cadastro de Instituições
            </span>
          </div>

          <div
            className="flex gap-1"
            style={{ alignItems: "center", gap: "1rem" }}
          >
            {expanded && (
              <Button
                type="primary"
                onClick={onFilter}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FilterOutlined className="ifes-icon" />
                <span style={{ marginLeft: "5px" }}>Filtrar</span>
              </Button>
            )}

            <Button
              className="ifes-btn-success"
              onClick={() => {
                navigate("/Cadastros/Instituições/Cadastrar");
              }}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PlusOutlined className="ifes-icon" />
              <span style={{ marginLeft: "5px" }}>Adicionar</span>
            </Button>
          </div>
        </div>
      ),
      children: (
        <div
          className="flex filtros-card"
          style={{ padding: "10px 0", display: "flex", gap: "20px" }}
        >
          <Form
            form={formFilter}
            layout="vertical"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Form.Item name="nome" label="Nome">
              <Input placeholder="Nome" style={{ width: "200px" }} />
            </Form.Item>

            <Form.Item name="tipoInstituicao" label="Tipo de Instituição">
              <Select placeholder="selecione">
                {tipoInstituicoes.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <CardFooter>
        <Collapse
          accordion
          items={items}
          onChange={(key) => setExpanded(key.includes("1"))}
        />
      </CardFooter>

      {/* Tabela */}
      <Table columns={columns} dataSource={instituicoes} loading={loading} />
    </>
  );
};

export default Instituicoes;
