import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { ColumnsType } from "antd/es/table";
import ApiService from "../../services/ApiService";


interface DataType {
  key: React.Key;
  nome: string;
  projeto: string;
  tipoAcao: string;
  publicoAlvo: string;
  instituicaoAtendida: string;
  numeroVagas: number;
  duracao: string;
  horarioInicio: string;
  horarioTermino: string;
}

const Acoes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [, setExpanded] = useState(false);
  const [formFilter] = Form.useForm();
  const [data, setData] = useState<any[]>();
  const apiService: ApiService = new ApiService();

  const onFilter = () => {};

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className="title-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex gap-1" style={{ alignItems: "center" }}>
            <SolutionOutlined
              style={{ fontSize: "18px", marginRight: "8px" }}
            />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Ações</span>
          </div>

          <div
            className="flex gap-1"
            style={{ alignItems: "center", gap: "1rem" }}
          >
            <Button
              type="primary"
              onClick={() => {
                onFilter();
              }}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FilterOutlined className="ifes-icon" />
              <span style={{ marginLeft: "5px" }}>Filtrar</span>
            </Button>

            <Button
              className="ifes-btn-success"
              onClick={() => {
                navigate("/Cadastros/Acoes/Cadastrar Nova Ação");
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
        <div>
          <Form form={formFilter} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name="nome" label="Nome da Ação">
                  <Input></Input>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="tipoAcao" label="Tipo Ação">
                  <Select
                    placeholder="Selecione um tipo ação"
                    style={{ width: "100%" }}
                  >
                    {[]?.map((option: any) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="projeto" label="Projeto">
                  <Select
                    placeholder="Selecione um projeto"
                    style={{ width: "100%" }}
                  >
                    {[]?.map((option: any) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name="projeto" label="Periodo">
                  <Select
                    placeholder="Selecione um projeto"
                    style={{ width: "100%" }}
                  >
                    {[]?.map((option: any) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}></Col>

              <Col span={8}></Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];

  const onDelete = async (id: number) => {
    try {
      await apiService.remove(`acoes/delete/${id}`);
      setData(data?.filter((curso) => curso.id !== id));
      message.success("Ação excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Tipo Ação",
      dataIndex: "tipoAcao",
      key: "tipoAcao",
      render: (record: any) => record.nome,
    },
    {
      title: "Instituição Atendida",
      dataIndex: "instituicaoAtendida",
      key: "instituicaoAtendida",
      render: (record: any) => record.nome,
    },
    {
      title: "Número de Vagas",
      dataIndex: "qtdVagas",
      key: "numeroVagas",
    },

    {
      title: "Ações",
      key: "actions",
      dataIndex: "id",
      render: (record: any) => (
        <Space size="middle">
          <Tooltip title="Visualizar informações">
            <Button
              type="primary"
              icon={<InfoCircleOutlined />}
              onClick={() => {
               
              }}
              className="ifes-btn-info"
            ></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              className="ifes-btn-warning"
              icon={<EditOutlined />}

              onClick={() => {
                navigate("/Ações/Editar Ação",{ state: { id: record } });
              }}
            ></Button>
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
                icon={<DeleteOutlined className="ifes-icon" />}
                onClick={() => {}}
              >
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getContextData = async () => {
    setLoading(true);
    try {
      //const response: AcaoContextDataType = await get("acoes/contextData");
      //setAcaoContexData(response);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAcoes = async () => {
    setLoading(true);
    try {
      const response: any[] = await apiService.get("acoes");
      setData(response);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContextData();
    getAcoes();
  }, []);

  return (
    <>
      <div className="" style={{ flex: 1, marginBottom: "1rem" }}>
        <Collapse
          accordion
          items={items}
          activeKey={["1"]}
          defaultActiveKey={["1"]}
          onChange={(key) => setExpanded(key.includes("1"))}
        />
      </div>

      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
};

export default Acoes;
