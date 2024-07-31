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
  message,
  Spin,
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

const EmitirRelatorio = () => {
  const [formFilter] = Form.useForm();
  const [tipoAcoes, setTipoAcoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState();
  const [isUpdateAcao, setIsUpdateAcao] = useState(true);
  const [idAcao, setIdAcao] = useState(0);
  const navigate = useNavigate();
  const apiService: ApiService = new ApiService();
  const [data, setData] = useState<any[]>([]);

  const onDelete = async (id: number) => {
    try {
      setLoading(true);
      await apiService.remove(`acoes/delete/${id}`);
      setData(data.filter((acao) => acao.id !== id));
      message.success("Ação excluída com sucesso");
      onFilter();
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir ação:", error);
    }
  };

  const onFilter = async () => {
    setLoading(true); // Iniciar o carregamento
    let values = formFilter.getFieldsValue();
    const pessoas = values?.pessoas?.map(x => ({ id: x }))
    values = {
      ...values,
      pessoas: pessoas?.length > 0 ? pessoas :  null,

    }
    const res = await apiService.post("/acoes/relatorios", values);
    setData(res);
    setLoading(false); // Finalizar o carregamento
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

          </div>
        </div>
      ),
      children: (
        <div>
          <Form
            form={formFilter}
            layout="vertical"
            initialValues={{ ano: "2024" }}
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
                <Form.Item name="idTipoAcao" label="Tipo Ação">
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
                <Form.Item name="idProjeto" label="Projeto">
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
                <Form.Item name="dtInicio" label="Data Início">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Selecione a data de início"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="dtTermino" label="Data de Término">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Selecione a data de término"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="pessoas" label="Participantes">
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
      const response: AcaoContextDataType = await apiService.get(
        "acoes/contextData"
      );
      setContextData(response);
      setTipoAcoes(response.tipoAcoes);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
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

  const openModalInfo = (id: any) => {
    setIdAcao(id);
  };

  const handleCancelInfo = () => {
    setIdAcao(0);
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
                setIsUpdateAcao(false);
                openModalInfo(record);
              }}
              className="ifes-btn-info"
            ></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              className="ifes-btn-warning"
              icon={<EditOutlined />}
              onClick={() => {
                setIsUpdateAcao(true);
                openModalInfo(record);
              }}
            ></Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir esta ação?"
              onConfirm={() => onDelete(record)}
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

    const filteredData = data.filter((item) => item.tipoAcao === record.nome);

    return (
      <>
        {record.nome == "Projeto" ? (
          <Table
            columns={innerColumnsProjeto}
            dataSource={filteredData?.filter((x) => x.projetoId <= 0)}
            pagination={false}
            expandedRowRender={expandedRowRenderProjeto}
            rowKey={(childRecord) => childRecord.key}
          />
        ) : (
          <Table
            columns={innerColumns}
            dataSource={filteredData?.filter((x) => x.projetoId <= 0)}
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
      <Spin size="large" spinning={loading}>
        {data.length > 0 ? (
          <Table
            columns={columns}
            dataSource={tipoAcoes.filter((tipoAcao) =>
              data.some((acao) => acao.tipoAcao === tipoAcao.nome)
            )}
            loading={loading}
            pagination={false}
            expandedRowRender={expandedRowRender}
            rowKey={(record) => record.id}
          />
        ) : (
          <p>Nenhum dado encontrado</p>
        )}
      </Spin>

      <Modal
        title=""
        width={"90%"}
        visible={idAcao > 0}
        onOk={handleCancelInfo}
        onCancel={handleCancelInfo}
        footer={<></>}
      >
        <DetalhesAcao id={idAcao} isUpdate={isUpdateAcao} />
      </Modal>
    </div>
  );
};

export default EmitirRelatorio;
