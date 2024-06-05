import { Button, Input, Select, Table } from "antd";
import columns from "./columnsDefs";
import data from "./data";
import "./styles.css";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { CardFooter } from "../../../components/CardFooter";

const { Option } = Select;

export default function Usuarios() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <CardFooter >
        <div className="flex justify-content-between">
          {/* Filtros */}
          <div className="flex filtros-card">
            <Input placeholder="Nome" style={{width: '200px'}} />

            <Select style={{width: '250px'}}placeholder="Especialidades">
                <Option value="EST">Engenheiro de Segurança do Trabalho</Option>
                <Option value="EE">Engenheiro Eletricista</Option>
                <Option value="EM">Engenheiro Mecânico</Option>
                <Option value="ET">Médico do Trabalho</Option>
            </Select>

            <Select style={{width: '250px'}}placeholder="Emp. Acessada Pelo Usuário">
                <Option value="EST">Administrador</Option>
                <Option value="EE">Contratada</Option>
                <Option value="EM">Contratante</Option>
                <Option value="ET">Credenciada</Option>
            </Select>

            <Input placeholder="Empresa" style={{width: '200px'}} />
          </div>


          <div>
            <Button
              className="ifes-btn-success"
              onClick={() => {
                navigate("/Cadastros/Usuários/Cadastrar");
              }}
            >
              <PlusOutlined className="ifes-icon" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardFooter>

      <Table columns={columns} dataSource={data} />
    </>
  );
}
