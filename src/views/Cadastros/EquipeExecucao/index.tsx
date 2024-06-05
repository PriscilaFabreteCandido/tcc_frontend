import { Button, Input,  Space, Switch, Table, Tooltip, Typography } from "antd";
import React from "react";
import "./styles.css";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, InfoOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  id: number;
  nome: string;
  cpf: string;
  dtNascimento: any;
  equipeExecucao: any;
  email: any;
  dtSaida: any;
  curso: any;
}

export default function EquipesExecucao() {
  const navigate = useNavigate();

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "nome",
      sorter: (a, b) => a.nome.length - b.nome.length,
      sortDirections: ["descend"],
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      sorter: (a, b) => a.cpf.length - b.cpf.length,
      sortDirections: ["descend"],
    },
    {
      title: "Data de Nascimento",
      dataIndex: "dtNascimento",
      sorter: (a, b) => a.dtNascimento.length - b.dtNascimento.length,
      sortDirections: ["descend"],
    },
    {
      title: "Equipe de Execução",
      dataIndex: "equipeExecucao",
      sorter: (a, b) => a.equipeExecucao.length - b.equipeExecucao.length,
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend"],
    },
    {
      title: "Data de saída",
      dataIndex: "dtSaida",
      sorter: (a, b) => a.dtSaida.length - b.dtSaida.length,
      sortDirections: ["descend"],
    },
    {
      title: "Carga Horária Semanal",
      dataIndex: "email",
      sorter: (a, b) => a.dtSaida.length - b.dtSaida.length,
      sortDirections: ["descend"],
    },
    {
      title: "Carga Horária Semanal",
      dataIndex: "email",
      sorter: (a, b) => a.dtSaida.length - b.dtSaida.length,
      sortDirections: ["descend"],
    },
    {
      title: "Curso",
      dataIndex: "curso",
      sorter: (a, b) => a.curso.length - b.curso.length,
      sortDirections: ["descend"],
    },
    {
      title: "Ações",
      key: "acao",
      render: (record:any) => (
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

          <Tooltip title={record.ativo ? "Desativar Exame" : "Ativar Exame"}>
            <Button
              className={
                record.ativo ? "ifes-btn-success" : "ifes-btn-danger"
              }
              shape="circle"
              onClick={() => {}}
            >
              {record.ativo ? (
                <CloseCircleOutlined className="ifes-icon" />
              ) : (
                <CheckCircleOutlined className="ifes-icon" />
              )}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Header */}

      <div className="flex justify-content-between pb-1">
        {/* Filtros */}
        <div className="flex filtros-card">
          <Input placeholder="Código E-social" style={{ width: "200px" }} />
          <Input placeholder="Exame" style={{ width: "200px" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            <Typography.Text style={{ marginRight: "8px" }}>
              Ativo:
            </Typography.Text>
            <Switch defaultChecked />
          </div>
        </div>

        <div>
          <Button
            className="ifes-btn-success"
            onClick={() => {
              navigate("/Equipes de Execução/Cadastrar");
            }}
            value="large"
          >
            <PlusOutlined className="ifes-icon" />
            Adicionar
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={[]} />
    </>
  );
}
