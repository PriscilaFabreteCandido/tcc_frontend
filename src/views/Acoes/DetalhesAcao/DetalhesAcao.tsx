import { Col, Row, Table, Typography, Input, DatePicker, Form, Button, Spin, Select } from "antd";
import { useEffect, useState } from "react";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { colors } from "../../../global/theme/theme";
import ApiService from "../../../services/ApiService";
import moment from "moment";
import { AcaoContextDataType } from "../CadastrarAcoes";
import { modalidades } from "../../../data/modalidades";

const { Title } = Typography;
const { Option } = Select;

export interface Participante {
  pessoa: { nome: string };
  funcao: { nome: string };
}

export interface Documento {
  name: string;
  url: string;
}

export interface DetalhesAcaoProps {
  id: any;
}

const DetalhesAcao: React.FC<DetalhesAcaoProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [acao, setAcao] = useState<any>({});
  const [tipoAcoes, setTipoAcoes] = useState<any[]>([]);
  const [contextDta, setContextData] = useState<AcaoContextDataType>();
  
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [form] = Form.useForm();
  const apiService: ApiService = new ApiService();

  const getAcaoById = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiService.get(`acoes/${id}`);
      console.log(response);
      setAcao(response);
      setParticipants(response.participantes ?? []);
      setDocuments(response.documentos ?? []);
      form.setFieldsValue({
        ...response,
        dtInicio: response.dtInicio ? moment(response.dtInicio) : null,
        dtTermino: response.dtTermino ? moment(response.dtTermino) : null,
      });
    } catch (error) {
      console.error("Erro ao obter ação pelo ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const getContextData = async () => {
    setLoading(true);
    try {
      const response: any = await apiService.get("acoes/contextData");
      setTipoAcoes(response.tipoAcoes);
      setContextData(response);
    } catch (error) {
      console.error("Erro ao obter context data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContextData();
    getAcaoById(id);
  }, [id]);

  const columnsParticipants = [
    {
      title: "Nome do Participante",
      dataIndex: ["pessoa", "nome"],
      key: "pessoa",
    },
    {
      title: "Função",
      dataIndex: ["funcao", "nome"],
      key: "funcao",
    },
  ];

  const columnsDocuments = [
    {
      title: "Nome do Documento",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await apiService.put(`acoes/${id}`, values);
      console.log("Success:", values);
    } catch (error) {
      console.error("Erro ao atualizar a ação:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin tip="Loading..." />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Title level={4} className="color-primary mb-1">
        <InfoCircleOutlined style={{ color: colors.primary }} /> Detalhes da Ação
      </Title>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Tipo Ação" name="tipoAcao">
            <Select>
              {tipoAcoes.map((tipo: any) => (
                <Option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Projeto" name="projeto">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Evento" name="evento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={14}>
          <Form.Item label="Nome da Ação" name="nome">
            <Input />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="Público Alvo" name="publicoAlvo">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Data Início" name="dtInicio">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Data Término" name="dtTermino">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Instituição Atendida" name="instituicaoAtendida">
            <Select>
              {contextDta?.instituicoes?.map((instituicao: any) => (
                <Option key={instituicao.id} value={instituicao.id}>
                  {instituicao.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Turma" name="turma">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Período Semestre" name="periodoSemestre">
            <Select>
              {contextDta?.periodos?.map((semestre: any) => (
                <Option key={semestre.id} value={semestre.id}>
                  {semestre.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Modalidade" name="modalidade">
            <Select>
              {modalidades.map((modalidade: any) => (
                <Option key={modalidade.id} value={modalidade.id}>
                  {modalidade.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Horário de Início" name="inicio">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Horário de Término" name="fim">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Número do Processo" name="numeroProcesso">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Quantidade de Vagas" name="qtdVagas">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quantidade de Participantes" name="qtdParticipantes">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Title level={4} className="color-primary" style={{ marginTop: "1.5rem" }}>
        <EnvironmentOutlined className="color-primary" /> Local de Realização
      </Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Local de Realização" name="localRealizacao">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Title level={4} className="color-primary" style={{ marginTop: "1.5rem" }}>
        <UserOutlined className="color-primary" /> Participantes
      </Title>
      <Table
        dataSource={participants}
        columns={columnsParticipants}
        rowKey={(record) => record.pessoa.nome}
      />
      <Title level={4} className="color-primary" style={{ marginTop: "1.5rem" }}>
        <FileTextOutlined className="color-primary" /> Documentos
      </Title>
      <Table
        dataSource={documents}
        columns={columnsDocuments}
        rowKey={(record) => record.name}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DetalhesAcao;
