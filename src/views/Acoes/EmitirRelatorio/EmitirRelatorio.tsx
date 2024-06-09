import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  CollapseProps,
  DatePicker,
  Form,
  Collapse,
  Row,
  Col,
} from "antd";
import {
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { get } from "../../../api/axios";
import { ActionType } from "../../Cadastros/TipoAcoes";

const EmitirRelatorio = () => {
  const [formFilter] = Form.useForm();
  const [tiposAcoes, setTiposAcoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const data = [
    {
      key: "1",
      id: 1,
      ano: "2021",
      tipoAcao: "Curso",
      descricao: "Curso de Java",
    },
    {
      key: "2",
      id: 2,
      ano: "2022",
      tipoAcao: "Projeto",
      descricao: "Projeto de Pesquisa",
    },
    {
      key: "3",
      id: 3,
      ano: "2023",
      tipoAcao: "Palestra",
      descricao: "Palestra sobre IA",
    },
    {
      key: "4",
      id: 4,
      ano: "2023",
      tipoAcao: "Visita Guiada",
      descricao: "Visita ao Museu",
    },
    {
      key: "5",
      id: 5,
      ano: "2021",
      tipoAcao: "Curso",
      descricao: "Curso de Python",
    },
    {
      key: "6",
      id: 6,
      ano: "2022",
      tipoAcao: "Projeto",
      descricao: "Projeto de Robótica",
    },
    {
      key: "7",
      id: 7,
      ano: "2023",
      tipoAcao: "Palestra",
      descricao: "Palestra sobre Segurança",
    },
    {
      key: "8",
      id: 8,
      ano: "2023",
      tipoAcao: "Visita Guiada",
      descricao: "Visita à Fábrica",
    },
    {
      key: "9",
      id: 9,
      ano: "2023",
      tipoAcao: "Curso",
      descricao: "Curso de Informática",
      projetoId: 2,
    },
    {
      key: "10",
      id: 10,
      ano: "2023",
      tipoAcao: "Palestra",
      descricao: "Curso de python",
      projetoId: 2,
    },
    {
      key: "10",
      id: 10,
      ano: "2023",
      tipoAcao: "Curso",
      descricao: "Curso de python",
      projetoId: 2,
    },
  ];

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
          <div className="flex gap-1" style={{}}>
            <FileOutlined
              style={{
                fontSize: "18px",
                marginRight: "8px",
                alignItems: "center",
              }}
            />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Emitir Relatório
            </span>
          </div>

          <div className="flex gap-1" style={{ gap: "1rem" }}>
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
              className="ifes-btn-danger"
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FilePdfOutlined className="ifes-icon" />
              <span style={{ marginLeft: "5px" }}>Emitir PDF</span>
            </Button>

            <Button
              className="ifes-btn-warning"
              type="primary"
              onClick={() => {
                // Lógica de emissão de relatório em Excel
              }}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <FileExcelOutlined className="ifes-icon" />
              <span style={{ marginLeft: "5px" }}>Emitir Excel</span>
            </Button>
          </div>
        </div>
      ),
      children: (
        <div>
          <Form form={formFilter} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name="ano" label="Ano">
                  <Select
                    placeholder="Selecione um período"
                    style={{ width: "100%" }}
                  >
                    {["2024", "2023", "2022", "2021"].map((option: string) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="tipoAcao" label="Tipo Ação">
                  <Select
                    placeholder="Selecione um tipo de ação"
                    style={{ width: "100%" }}
                  >
                    {tiposAcoes.map((option: any) => (
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
                    {tiposAcoes.map((option: any) => (
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
                <Form.Item name="inicio" label="Data Início">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Selecione a data de início"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="termino" label="Data de Término">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Selecione a data de término"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="participantes" label="Participantes">
                  <Select
                    placeholder="Selecione um projeto"
                    style={{ width: "100%" }}
                    showSearch
                  >
                    {tiposAcoes.map((option: any) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];

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

  const columns = [
    {
      title: "Tipo de Ação",
      dataIndex: "nome",
      key: "nome",
    },
  ];

  const expandedRowRenderProjeto = (record:any) => {
    const innerColumnsProjeto = [
      {
        title: "Ano",
        dataIndex: "ano",
        key: "ano",
      },
      {
        title: "Descrição",
        dataIndex: "descricao",
        key: "descricao",
      },
    ];
  
    // Filtrar os dados que são filhos do projeto
    const filteredChildren = data.filter((item) => item.projetoId === record.id);
  
    return (
      <Table
        columns={innerColumnsProjeto}
        dataSource={filteredChildren}
        pagination={false}
        rowKey={(childRecord) => childRecord.key}
      />
    );
  };
  
  const expandedRowRender = (record:any) => {
    const innerColumns = [
      {
        title: "Ano",
        dataIndex: "ano",
        key: "ano",
      },
      {
        title: "Descrição",
        dataIndex: "descricao",
        key: "descricao",
      },
    ];

    const innerColumnsProjeto = [
      {
        title: "Descrição",
        dataIndex: "descricao",
        key: "descricao",
      },
    ];
  
    // Filtrar os dados pelo tipo de ação
    const filteredData = data.filter((item) => item.tipoAcao === record.nome);
    
    return (
      <>
        {record.nome == "Projeto" ? (
          <Table
            columns={innerColumnsProjeto}
            dataSource={filteredData}
            pagination={false}
            expandedRowRender={expandedRowRenderProjeto}
            rowKey={(childRecord) => childRecord.key}
          />
        ) : (
          <Table
            columns={innerColumns}
            dataSource={filteredData}
            pagination={false}
            rowKey={(childRecord) => childRecord.key}
          />
        )}
      </>
    );
  };
  
  return (
    <div>
      <div className="" style={{ flex: 1, marginBottom: "1rem" }}>
        <Collapse
          accordion
          items={items}
          activeKey={["1"]}
          defaultActiveKey={["1"]}
        />
      </div>
      <Table
        columns={columns}
        dataSource={tiposAcoes}
        loading={loading}
        pagination={false}
        expandedRowRender={expandedRowRender}
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default EmitirRelatorio;
