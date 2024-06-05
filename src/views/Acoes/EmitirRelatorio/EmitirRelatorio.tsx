import  { useEffect, useState } from "react";
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
      year: "2021",
      type: "Curso",
      description: "Curso de Java",
    },
    {
      key: "2",
      year: "2022",
      type: "Projeto",
      description: "Projeto de Pesquisa",
    },
    {
      key: "3",
      year: "2023",
      type: "Palestra",
      description: "Palestra sobre IA",
    },
    {
      key: "4",
      year: "2023",
      type: "Visita Guiada",
      description: "Visita ao Museu",
    },
    {
      key: "5",
      year: "2021",
      type: "Curso",
      description: "Curso de Python",
    },
    {
      key: "6",
      year: "2022",
      type: "Projeto",
      description: "Projeto de Robótica",
    },
    {
      key: "7",
      year: "2023",
      type: "Palestra",
      description: "Palestra sobre Segurança",
    },
    {
      key: "8",
      year: "2023",
      type: "Visita Guiada",
      description: "Visita à Fábrica",
    },
  ];

  const onFilter = () => { };

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
          <Form
            form={formFilter}
            layout="vertical"
          >
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
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Selecione a data de início" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="termino" label="Data de Término">
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Selecione a data de término" />
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

  // Função para agrupar dados pelo tipo de ação
  const groupedData = data.reduce((acc:any, item:any) => {
    const existingGroup = acc.find((group:any) => group.type === item.type);
    if (existingGroup) {
      existingGroup.children.push(item);
    } else {
      acc.push({
        type: item.type,
        children: [item]
      });
    }
    return acc;
  }, []);

  const columnsWithGrouping = [
    {
      title: "Tipo de Ação",
      dataIndex: "type",
      key: "type",
      render: (record:any) => {
        if (record.children) {
          return {
            children: record.type,
            props: {
              colSpan: 3,
              className: 'group-header',
            },
          };
        }
        return record.type;
      },
    },
    {
      title: "Ano",
      dataIndex: "year",
      key: "year",
      render: (text:any, record:any) => (record.children ? { props: { colSpan: 0 } } : text),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: ( text:any, record:any) => (record.children ? { props: { colSpan: 0 } } : text),
    },
  ];

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
        columns={columnsWithGrouping}
        dataSource={groupedData}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.key || record.type}
      />
    </div>
  );
};

export default EmitirRelatorio;
