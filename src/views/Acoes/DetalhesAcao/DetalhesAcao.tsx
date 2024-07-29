import {
  Col,
  Row,
  Table,
  Typography,
  Input,
  DatePicker,
  Form,
  Button,
  Spin,
  Select,
  Modal,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
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
  isUpdate: boolean;
}

const DetalhesAcao: React.FC<DetalhesAcaoProps> = ({ id, isUpdate = true }) => {
  const [loading, setLoading] = useState(true);
  const [acao, setAcao] = useState<any>({});
  const [tipoAcoes, setTipoAcoes] = useState<any[]>([]);
  const [contextDta, setContextData] = useState<AcaoContextDataType>();

  const [participants, setParticipants] = useState<Participante[]>([]);
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [form] = Form.useForm();
  const [formParticipantes] = Form.useForm();
  const apiService: ApiService = new ApiService();
  const [tipoAcao, setTipoAcao] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAcaoById = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiService.get(`acoes/${id}`);
      console.log(response);
      setAcao(response);
      setParticipants(response.acaoPessoas ?? []);
      setDocuments(response.documentos ?? []);
      setTipoAcao(response.tipoAcao);
      form.setFieldsValue({
        ...response,
        tipoAcao: response.tipoAcao?.id,
        projeto: response.projeto?.id,
        instituicaoAtendida: response.instituicaoAtendida?.id,
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

  const onChangeTipoAcao = (e: any) => {
    const acao = tipoAcoes?.find((x) => x.id == e);
    setTipoAcao(acao);
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

  const downloadBase64File = (base64Data, fileName) => {
    const blob = new Blob(
      [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
      { type: "application/octet-stream" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columnsDocuments = [
    {
      title: "Nome do Documento",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Ações",
      key: "actions",
      render: (record: any) => (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadBase64File(record.conteudo, record.nome)}
        >
          Download
        </Button>
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

  const handleAddParticipant = () => {
    formParticipantes
      .validateFields()
      .then((values) => {
        setParticipants([...participants, values]);
        setIsModalVisible(false);
        formParticipantes.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const updateAcao = async () => {
    try {
      await form.validateFields();
      const allValues = form.getFieldsValue();
      console.log("allValues", allValues, participants);

      const acaoToCreateOrEdit = {
        id: id,
        ...allValues,
        projeto: {
          id: allValues.projeto,
        },
        tipoAcao: {
          id: allValues.tipoAcao,
        },
        instituicaoAtendida: {
          id: allValues.instituicaoAtendida,
        },

        // documentos,
        acaoPessoas: participants,
      };

      console.log("acaoToCreateOrEdit", acaoToCreateOrEdit);

      await apiService.put(`acoes/update/${id}`, acaoToCreateOrEdit);
      message.success("Ação editada com sucesso");
    } catch (error) {
      console.error("Erro ao cadastrar/editar ação:", error);
    }
  };

  if (loading) return <Spin tip="Loading..." />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Title level={4} className="color-primary mb-1">
        <InfoCircleOutlined style={{ color: colors.primary }} /> Detalhes da
        Ação
      </Title>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Tipo Ação" name="tipoAcao">
            <Select onChange={(e) => onChangeTipoAcao(e)}>
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
            <Select>
              {contextDta?.projetos?.map((tipo: any) => (
                <Option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Evento" name="evento">
            <Select>
              {contextDta?.eventos?.map((tipo: any) => (
                <Option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </Option>
              ))}
            </Select>
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
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Data Término" name="dtTermino">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
      {tipoAcao?.nome == "Curso" && (
        <>
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
                    <Option key={modalidade} value={modalidade}>
                      {modalidade}
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
        </>
      )}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Quantidade de Vagas" name="qtdVagas">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Quantidade de Participantes"
            name="qtdParticipantes"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Title
        level={4}
        className="color-primary"
        style={{ marginTop: "1.5rem" }}
      >
        <EnvironmentOutlined className="color-primary" /> Local de Realização
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Endereço" name="endereco">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Cidade" name="cidade">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="CEP" name="cep">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Bairro" name="bairro">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Número" name="numero">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Complemento" name="complemento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Title
        level={4}
        className="color-primary"
        style={{ marginTop: "1.5rem" }}
      >
        <UserOutlined className="color-primary" /> Participantes
        <Button type="primary" onClick={showModal} style={{ float: "right" }}>
          Adicionar Participante
        </Button>
      </Title>
      <Table
        dataSource={participants}
        columns={columnsParticipants}
        rowKey={(record) => record.pessoa.nome}
      />
      <Title
        level={4}
        className="color-primary"
        style={{ marginTop: "1.5rem" }}
      >
        <FileTextOutlined className="color-primary" /> Documentos
      </Title>
      <Table
        dataSource={documents}
        columns={columnsDocuments}
        rowKey={(record) => record.name}
      />
      <Form.Item>
        {isUpdate && (
          <Button
            type="primary"
            onClick={() => updateAcao()}
            htmlType="submit"
            loading={loading}
            style={{ float: "right" }}
          >
            Editar
          </Button>
        )}
      </Form.Item>

      <Modal
        title="Adicionar Participante"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddParticipant}
      >
        <Form form={formParticipantes} layout="vertical">
          <Form.Item
            label="Participante"
            name="pessoa"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do participante!",
              },
            ]}
          >
            <Select>
              {contextDta?.pessoas?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Função"
            name="funcao"
            rules={[{ required: true, message: "Por favor, insira a função!" }]}
          >
            <Select>
              {contextDta?.funcoes?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};

export default DetalhesAcao;
