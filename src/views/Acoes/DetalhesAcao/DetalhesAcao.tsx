import { Col, Row, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { get } from "../../../api/axios";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { colors } from "../../../global/theme/theme";

const { Title, Text } = Typography;

export interface Participante {
  pessoa: { nome: string };
  funcao: { nome: string };
}

export interface Documento {
  name: string;
  url: string;
}

export interface DetalhesAcaoProps {
  id: string;
}

const DetalhesAcao: React.FC<DetalhesAcaoProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [acao, setAcao] = useState<any>({});
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [documents, setDocuments] = useState<Documento[]>([]);

  const getAcaoById = async (id: string) => {
    setLoading(true);
    try {
      const response = await get(`acoes/${id}`);
      setAcao(response);
      setParticipants(response.participantes);
      setDocuments(response.documentos);
    } catch (error) {
      console.error("Erro ao obter ação pelo ID:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {acao && (
        <div>
          <Title level={4} className="color-primary mb-1"  >
            <InfoCircleOutlined style={{color: colors.primary }}/> Detalhes da Ação
          </Title>

          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Tipo Ação:</Text>
              <Text>{acao.tipoAcao}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Projeto:</Text>
              <Text>{acao.projeto}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Evento:</Text>
              <Text>{acao.evento}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={14}>
              <Text strong>Nome da Ação:</Text>
              <Text>{acao.nome}</Text>
            </Col>
            <Col span={10}>
              <Text strong>Público Alvo:</Text>
              <Text>{acao.publicoAlvo}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Data Início:</Text>
              <Text>{acao.dtInicio}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Data Término:</Text>
              <Text>{acao.dtTermino}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Instituição Atendida:</Text>
              <Text>{acao.instituicaoAtendida}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Turma:</Text>
              <Text>{acao.turma}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Período Semestre:</Text>
              <Text>{acao.periodoSemestre}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Modalidade:</Text>
              <Text>{acao.modalidade}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Horário de Início:</Text>
              <Text>{acao.inicio}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Horário de Término:</Text>
              <Text>{acao.fim}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Número do Processo:</Text>
              <Text>{acao.numeroProcesso}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Quantidade de Vagas:</Text>
              <Text>{acao.qtdVagas}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Quantidade de Participantes:</Text>
              <Text>{acao.qtdParticipantes}</Text>
            </Col>
          </Row>
          <Title level={4} className="color-primary" style={{marginTop: "1.5rem"}}>
            <EnvironmentOutlined className="color-primary" /> Local de Realização
          </Title>
          <Row gutter={16}>
            <Col span={24}>
              <Text>{acao.localRealizacao}</Text>
            </Col>
          </Row>
          <Title level={4} className="color-primary" style={{marginTop: "1.5rem"}}>
            <UserOutlined className="color-primary"/> Participantes
          </Title>
          <Table
            dataSource={participants}
            columns={columnsParticipants}
            rowKey={(record) => record.pessoa.nome}
          />
          <Title level={4} className="color-primary" style={{marginTop: "1.5rem"}}>
            <FileTextOutlined className="color-primary"/> Documentos
          </Title>
          <Table
            dataSource={documents}
            columns={columnsDocuments}
            rowKey={(record) => record.name}
          />
        </div>
      )}
    </>
  );
};

export default DetalhesAcao;
