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
  Collapse,
  CollapseProps,
  Select,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post, remove } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { niveisEscolaridade } from "../../../data/niveisdeescolaridade";
import moment from "moment";

interface PessoaType {
  key: React.Key;
  id: number;
  nome: string;
  cpf: string;
  matricula: string;
  dataNascimento: string;
  email: string;
  instituicao: string;
  graduacao: string;
  ativo:boolean;
}


const Pessoas: React.FC = () => {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [formFilter] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getPessoas = async () => {
    setLoading(true);
    try {
      const response: PessoaType[] = await get("pessoas");
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

  const onDelete = async (id: number) => {
    try {
      await remove(`pessoas/delete/${id}`);
      setPessoas(pessoas.filter((pessoa) => pessoa.id !== id));
      message.success("Pessoa excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
    }
  };

  const handleToggleActive = (record:any) => {
    message.info(
      `A pessoa ${record.ativo ? 'não aparecerá' : 'aparecerá'} mais na busca de participantes ao cadastrar uma ação.`
    );
  };

  const columns: ColumnsType<PessoaType> = [
    {
      title: "Nome",
      dataIndex: "nome",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
    },
    {
      title: "Matrícula",
      dataIndex: "matricula",
    },
    {
      title: "Data de Nascimento",
      dataIndex: "dtNascimento",
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Instituição",
      dataIndex: "instituicao",
      render: (text) => text?.nome
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
                console.log('tes', record)
                navigate("/Cadastros/Pessoas/Cadastrar", { state: { pessoa: record } })
              }}
            >
              <EditOutlined className="ifes-icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir esta pessoa?"
              onConfirm={() => onDelete(record.id)}
              okText="Sim"
              cancelText="Cancelar"
            >
              <Button
                className="ifes-btn-danger"
                shape="circle"
                onClick={() => { }}
              >
                <DeleteOutlined className="ifes-icon" />
              </Button>
            </Popconfirm>
          </Tooltip>

          <Tooltip title={record.ativo ? "Desativar" : "Ativar"}>
            <Popconfirm
              title={`Tem certeza que deseja ${record.ativo ? 'desativar' : 'ativar'} esta pessoa?`}
              onConfirm={() => handleToggleActive(record)}
              okText="Sim"
              cancelText="Cancelar"
            >
              <Button className={record.ativo ? "ifes-btn-danger" : "ifes-btn-success"} shape="circle">
                {record.ativo ? <CloseOutlined className="ifes-icon" /> : <CheckOutlined className="ifes-icon" />}
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onFilter = async () => {
    try {
      setPessoas([])
      setLoading(true)
      const values = formFilter.getFieldsValue()
      const resp = await post(`pessoas/filter`, values);
      setPessoas(resp);

    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
    } finally {
      setLoading(false)
    }
  }

  const items: CollapseProps["items"] = [
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
          <div className="flex gap-1" style={{ alignItems: "center", }}>
            <UserOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Cadastro de Pessoas
            </span>
          </div>

          <div className="flex gap-1" style={{ alignItems: "center", gap: "1rem" }}>
            {expanded && (
              <Button
                type="primary"
                onClick={() => {
                  onFilter()
                }}
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
                navigate("/Cadastros/Pessoas/Cadastrar");
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
            <Form.Item name="CPF" label="CPF">
              <Input placeholder="CPF" style={{ width: "200px" }} />
            </Form.Item>

            <Form.Item name="Nome" label="Nome">
              <Input placeholder="Nome" style={{ width: "200px" }} />
            </Form.Item>

            <Form.Item name="nivelEscolaridade" label="Nível de Escolaridade">
              <Select placeholder="selecione">
                {niveisEscolaridade.map((option) => (
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
      <Table columns={columns} dataSource={pessoas} loading={loading} />
    </>
  );
};

export default Pessoas;


