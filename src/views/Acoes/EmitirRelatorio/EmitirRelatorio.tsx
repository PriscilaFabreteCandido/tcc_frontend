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
  Popconfirm,
  Space,
  Tooltip,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { iconOptions } from "../../Cadastros/TipoAcoes";
import { AcaoContextDataType } from "../CadastrarAcoes";
import DetalhesAcao from "../DetalhesAcao/DetalhesAcao";
import { useNavigate } from "react-router";
import ApiService from "../../../services/ApiService";
import { setDefaultAutoSelectFamily } from "net";

const EmitirRelatorio = () => {
  const [formFilter] = Form.useForm();
  const [tipoAcoes, setTipoAcoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState();
  const [isModalVisibleInfo, setIsModalVisibleInfo] = useState(false);
  const navigate = useNavigate();
  const apiService: ApiService = new ApiService();
  const [data, setData] = useState<any[]>();

  const onFilter = async () => {
    const values = formFilter.getFieldsValue();
    const res = await apiService.post("/acoes/relatorios",values );

    setData(res)
  };

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
          <Form form={formFilter} layout="vertical" initialValues={{ano: "2024"}}>
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
                    {tipoAcoes.map((option: any) => (
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
                    {contextData?.projetos?.map((option: any) => (
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
                    mode="multiple"
                  >
                    {contextData?.pessoas?.map((option: any) => (
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
                <Form.Item name="evento" label="Evento">
                  <Select
                    placeholder="Selecione um tipo de ação"
                    style={{ width: "100%" }}
                  >
                    {contextData?.eventos?.map((option: any) => (
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

  const getContextData = async () => {
    setLoading(true);
    try {
      const response: AcaoContextDataType = await apiService.get("acoes/contextData");
      setContextData(response);
      setTipoAcoes(response.tipoAcoes);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFilter();
    getContextData();
  }, []);

  const columns = [
    {
      title: "Tipo de Ação",
      dataIndex: "nome",
      key: "nome",
      render: (text: string, record: any) => (
        <span>
          {iconOptions.find((x) => x.value === record.icone)?.icon}{" "}
          {record.nome}
        </span>
      ),
    },
  ];

  const expandedRowRenderProjeto = (record: any) => {
    // Filtrar os dados que são filhos do projeto
    const filteredChildren = data.filter(
      (item) => item.projetoId === record.id
    );

    return (
      <Table
        columns={innerColumns}
        dataSource={filteredChildren}
        pagination={false}
        rowKey={(childRecord) => childRecord.key}
      />
    );
  };

  const openModalInfo = () => {
    setIsModalVisibleInfo(true);
  };

  const handleCancelInfo = () => {
    setIsModalVisibleInfo(false);
  };

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
                openModalInfo(record);
              }}
              className="ifes-btn-info"
            ></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              className="ifes-btn-warning"
              icon={<EditOutlined />}
              onClick={() => {navigate("/Ações/Editar Ação",{ state: { id: record } });}}
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
              ></Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
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
        dataSource={tipoAcoes}
        loading={loading}
        pagination={false}
        expandedRowRender={expandedRowRender}
        rowKey={(record) => record.id}
      />

      <Modal
        title=""
        width={"90%"}
        
        visible={isModalVisibleInfo}
        onOk={handleCancelInfo}
        onCancel={handleCancelInfo}
      >
        <DetalhesAcao id={""} />
      </Modal>
    </div>
  );
};

export default EmitirRelatorio;
