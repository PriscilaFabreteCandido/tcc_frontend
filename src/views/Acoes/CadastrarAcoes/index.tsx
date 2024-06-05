import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Steps,
  Table,
  TimePicker,
  TreeSelect,
  Upload,
  message,
} from "antd";

import "../styles.css";
import {
  PlusOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { get, post, put } from "../../../api/axios";
import { modalidades } from "../../../data/modalidades";


export interface AcaoContextDataType {
  projetos: any[];
  eventos: any[];
  turmas: any[];
  periodos: any[];
  tipoAcoes: any[];
  instituicoes: any[];
  funcoes: any[];
  pessoas: any[];
}

export default function CadastrarAcoes() {
  const [form] = Form.useForm();
  const [formParticipantes] = Form.useForm();
  const [selectedTipoAcao, setSelectedTipoAcao] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [acaoContexData, setAcaoContexData] = useState<AcaoContextDataType>();
  const [loading, setLoading] = useState(false);
  const [tipoAcoes, ] = useState<any[]>([{id: 1, nome: "Curso" }, {id: 2, nome: "Projeto",}, {id: 3, nome: "Evento",}])
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleAddParticipant = () => {
    formParticipantes.validateFields().then((values) => {
      const newValue = {
        funcao:  acaoContexData?.funcoes.find(x => x.id == values.funcao),
        participante: acaoContexData?.funcoes.find(x => x.id == values.participante)
      }
      setParticipants([...participants, newValue]);
      formParticipantes.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleDeleteParticipant = (record:any) => {
    setParticipants(
      participants.filter((participant) => participant.nome !== record.nome)
    );
  };

  const columns = [
    {
      title: "Nome do Participante",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Função",
      dataIndex: "funcao",
      key: "funcao",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (record:any) => (
        <Popconfirm
          title="Tem certeza que deseja excluir?"
          onConfirm={() => handleDeleteParticipant(record)}
          okText="Sim"
          cancelText="Não"
        ></Popconfirm>
      ),
    },
  ];

  const getContextData = async () => {
    setLoading(true);
    try {
      const response: AcaoContextDataType = await get("acoes/contextData");
      setAcaoContexData(response);
    } catch (error) {
      console.error("Erro ao obter cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContextData();
  }, []);

  const handleCadastrar = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const acaoToCreateOrEdit = {
        nome: values.nomeAcao,
        tipoAcao: values.tipoAcao,
        projeto: values.projeto,
        evento: values.evento,
        turma: values.turma,
        periodoSemestre: values.periodoSemestre,
        modalidade: values.modalidade,
        inicio: values.inicio,
        fim: values.fim,
        numeroProcesso: values.numeroProcesso,
        publicoAlvo: values.publicoAlvo,
        dataInicio: values.dataInicio,
        dataTermino: values.dataTermino,
        instituicaoAtendida: values.instituicaoAtendida,
        ano: values.ano,
        enderecoCep: values.enderecoCep,
        qtdeParticipantes: values.qtdeParticipantes,
        cargaHoraria: values.cargaHoraria,
        participantesPdf: values.participantesPdf?.file,
        documentos: values.documentos?.fileList,
      };

      console.log("acaoToCreateOrEdit", acaoToCreateOrEdit);
      if (!values.id) {
        await post("acoes/create", acaoToCreateOrEdit);
        message.success("Ação criada com sucesso");
        // Adicionar lógica adicional se necessário, como atualizar a lista de ações
      } else {
        await put(`acoes/update/${values.id}`, acaoToCreateOrEdit);
        message.success("Ação editada com sucesso");
        // Adicionar lógica adicional se necessário, como atualizar a lista de ações
      }

      navigate("/Consultar Ações");
    } catch (error: any) {
      console.error("Erro ao cadastrar/editar ação:", error);
    }
  };

  const steps = [
    {
      title: "Equipe de Execução",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Tipo Ação"
                name="tipoAcao"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecione um projeto!",
                  },
                ]}
              >
                <Select
                  placeholder="selecione"
                  onChange={(e) => {
                    console.log(
                      tipoAcoes.find((x) => x.id == e)
                    );
                    setSelectedTipoAcao(
                      tipoAcoes.find((x) => x.id == e)
                    );
                  }}
                >
                  {tipoAcoes.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Projeto" name="projeto">
                <Select
                  placeholder="Selecione um projeto"
                  disabled={selectedTipoAcao == "Projeto"}
                >
                  {acaoContexData?.projetos?.map((option) => (
                    <Select.Option key={option.id} value={option.nome}>
                      {option.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Evento" name="evento">
                <TreeSelect
                  disabled={selectedTipoAcao == "Projeto"}
                  showSearch
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Selecione um evento"
                  allowClear
                  treeDefaultExpandAll
                  treeData={acaoContexData?.eventos}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Informações Gerais",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                label="Nome da Ação"
                name="nomeAcao"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Público Alvo"
                name="publicoAlvo"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Data Início"
                name="dataInicio"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Data Término"
                name="dataTermino"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Instituição Atendida"
                name="instituicaoAtendida"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Select>
                  {acaoContexData?.instituicoes?.map((option) => (
                    <Select.Option key={option.value} value={option.id}>
                      {option.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedTipoAcao?.nome == "Curso" && (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Turma" name="turma" required>
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Período Semestre" name="periodoSemestre">
                    <Select placeholder="Selecione um projeto">
                      {acaoContexData?.periodos?.map((option) => (
                        <Select.Option key={option.id} value={option.nome}>
                          {option.periodo == "-"
                            ? option.ano
                            : option.ano + "/" + option.periodo}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Modalidade" name="modalidade" required>
                    <Select placeholder="Selecione um projeto">
                      {modalidades?.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Horário de Início"
                    name="inicio"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, insira o horário de início!",
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="00:00"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Horário de Término"
                    name="fim"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, insira o horário de término!",
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="00:00"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Número do Processo"
                    name="numeroProcesso"
                    required
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Row gutter={16}>
          <Col span={8}>
              <Form.Item
                label="Quantidade de Vagas"
                name="qtdVagas"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input type="number"></Input>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                label="Quantidade de Participantes"
                name="qtdParticipantes"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input type="number"></Input>
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Adicionar Participante
          </Button>

          <Table
            dataSource={participants}
            columns={columns}
            rowKey={(record) => record?.nome}
            style={{ marginTop: "1rem" }}
          />

          <Modal
            title="Adicionar Participante"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleAddParticipant}
          >
            <Form form={formParticipantes} layout="vertical">
              <Form.Item
                label="Participante"
                name="nome"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o nome do participante!",
                  },
                ]}
              >
                <Select
                  onChange={(e) => {
                    setSelectedTipoAcao(e);
                  }}
                >
                  {acaoContexData?.pessoas?.map((option) => (
                    <Select.Option key={option.value} value={option.id}>
                      {option.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Função"
                name="funcao"
                rules={[
                  { required: true, message: "Por favor, insira a função!" },
                ]}
              >
                <Select
                  onChange={(e) => {
                    setSelectedTipoAcao(e);
                  }}
                >
                  {acaoContexData?.funcoes?.map((option) => (
                    <Select.Option key={option.value} value={option.id}>
                      {option.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ),
    },
    {
      title: "Endereço de Realização",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="CEP"
                name="cep"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Endereço"
                name="endereco"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Rua"
                name="rua"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="UF"
                name="uf"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Cidade"
                name="cidade"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Número"
                name="numero"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Documentos",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Participantes (Anexar PDF)"
                name="participantesPdf"
              >
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Documentos (Anexar PDF/Excel/Doc)"
                name="documentos"
              >
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <h4 style={{ paddingBottom: "1rem" }} className="poppins-bold">
        Cadastrar Ações
      </h4>

      <Steps current={current} items={steps}></Steps>
      <Form form={form} layout="vertical">
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action" style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Próximo
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => handleCadastrar()}>
              Cadastrar <PlusOutlined />
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Anterior
            </Button>
          )}
        </div>
      </Form>
    </Spin>
  );
}
