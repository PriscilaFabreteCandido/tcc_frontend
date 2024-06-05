import React, { useState } from "react";
import {
  Button,
  Input,
  Select,

  Table,
} from "antd";
import { useNavigate } from "react-router";
import { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  nome: string;
  cpf: string;
  matricula: string;
  publicoAlvo: string;
}

const { Option } = Select;

const VincularEquipeExecucao: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [funcoesSelecionadas, setFuncoesSelecionadas] = useState<any>();
  const [filtros, setFiltros] = useState<{ matricula?: string; cpf?: string }>(
    {}
  );

  
  

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
    },
    {
      title: "Matrícula",
      dataIndex: "matricula",
      key: "matricula",
    },
    {
      title: "Instituição",
      dataIndex: "publicoAlvo",
      key: "publicoAlvo",
    },
    {
      title: "Função",
      dataIndex: "key",
      key: "funcao",
      render: (key) => (
        <Select
          defaultValue=""
          style={{ width: 120 }}
          onChange={(value) => {
            setFuncoesSelecionadas({
              ...funcoesSelecionadas,
              [key]: value,
            });
          }}
        >
          <Option value="bolsista">Bolsista</Option>
          <Option value="servidor">Servidor</Option>
          <Option value="palestrante">Palestrante</Option>
          {/* Adicione outras funções conforme necessário */}
        </Select>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      nome: "João",
      cpf: "123.456.789-01",
      matricula: "123456",
      publicoAlvo: "Instituição 1",
    },
    {
      key: "2",
      nome: "Maria",
      cpf: "987.654.321-01",
      matricula: "654321",
      publicoAlvo: "Instituição 2",
    },
  ];

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setFuncoesSelecionadas({});
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Matrícula"
          style={{ width: 200, marginRight: 8 }}
          onChange={(e) => setFiltros({ ...filtros, matricula: e.target.value })}
        />
        <Input
          placeholder="CPF"
          style={{ width: 200, marginRight: 8 }}
          onChange={(e) => setFiltros({ ...filtros, cpf: e.target.value })}
        />
      </div>
      <Table columns={columns} dataSource={data} rowSelection={rowSelection} />
      <Button
        type="primary"
        onClick={() => {
            navigate("/Eventos");
        }}
        disabled={selectedRowKeys.length === 0}
      >
        Confirmar
      </Button>
    </>
  );
};

export default VincularEquipeExecucao;
