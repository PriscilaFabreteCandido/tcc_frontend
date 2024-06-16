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
  const [stepValues, setStepValues] = useState({});

  const [formParticipantes] = Form.useForm();
  const [selectedTipoAcao, setSelectedTipoAcao] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [acaoContexData, setAcaoContexData] = useState<AcaoContextDataType>();
  const [loading, setLoading] = useState(false);
  const [tipoAcoes, setTipoAcoes] = useState<any[]>([]);
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  const next = async () => {
    try {
      await form.validateFields();
      const currentValues = form.getFieldsValue();
      setStepValues({ ...stepValues, ...currentValues });
      setCurrent(current + 1);
    } catch (error) {
      console.error('Erro ao validar campos:', error);
    }
  };
  
  const prev = () => {
    const previousValues = steps[current - 1].content.props.form.getFieldsValue();
    form.setFieldsValue({ ...previousValues });
    setCurrent(current - 1);
  };
  
  const handleAddParticipant = () => {
    formParticipantes.validateFields().then((values) => {
      const newValue = {
        funcao: acaoContexData?.funcoes.find((x) => x.id == values.funcao),
        pessoa: acaoContexData?.pessoas.find((x) => x.id == values.pessoa),
      };
      console.log("newValue", newValue, values);
      setParticipants([...participants, newValue]);
      formParticipantes.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleDeleteParticipant = (record: any) => {
    setParticipants(
      participants.filter((participant) => participant.nome !== record.nome)
    );
  };

  const columns = [
    {
      title: "Nome do Participante",
      dataIndex: "pessoa",
      key: "pessoa",
      render: (record: any) => record.nome,
    },
    {
      title: "Função",
      dataIndex: "funcao",
      key: "funcao",
      render: (record: any) => record.nome,
    },
    {
      title: "Ações",
      key: "acoes",
      render: (record: any) => (
        <Popconfirm
          title="Tem certeza que deseja excluir?"
          onConfirm={() => handleDeleteParticipant(record)}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="link">Excluir</Button>
        </Popconfirm>
      ),
    },
  ];

  const getContextData = async () => {
    setLoading(true);
    try {
      const response: AcaoContextDataType = await get("acoes/contextData");
      setAcaoContexData(response);
      setTipoAcoes(response.tipoAcoes)
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
      const currentValues = form.getFieldsValue();
      const allValues = { ...stepValues, ...currentValues };
      console.log('allValues', allValues,participants);
      
      const acaoToCreateOrEdit = {
        ...allValues,
        tipoAcao: {
          id: allValues.tipoAcao
        },
        instituicaoAtendida: {
          id: allValues.instituicaoAtendida
        },
        participantesPdf: allValues.participantesPdf?.file,
        documentos: allValues.documentos?.fileList,
        acoesPessoas: participants,
      };
  
      console.log("acaoToCreateOrEdit", acaoToCreateOrEdit);
      if (!allValues.id) {
        await post("acoes/create", acaoToCreateOrEdit);
        message.success("Ação criada com sucesso");
      } else {
        await put(`acoes/update/${allValues.id}`, acaoToCreateOrEdit);
        message.success("Ação editada com sucesso");
      }
  
      navigate("/Consultar Ações");
    } catch (error) {
      console.error("Erro ao cadastrar/editar ação:", error);
    }
  };
  
  const steps = [
    {
      title: "Equipe de Execução",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Form form={form} layout="vertical" initialValues={stepValues}>
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
                      console.log(tipoAcoes.find((x) => x.id == e));
                      setSelectedTipoAcao(tipoAcoes.find((x) => x.id == e));
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
          </Form>
        </div>
      ),
    },
    {
      title: "Informações Gerais",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Form form={form} layout="vertical" initialValues={stepValues}>
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
                  name="dtInicio"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Data Término"
                  name="dtTermino"
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
                  name="pessoa"
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
          </Form>
        </div>
      ),
    },
    {
      title: "Endereço de Realização",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Form form={form} layout="vertical" initialValues={stepValues}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="CEP"
                  name="cep"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input onChange={(e:any) => buscarEnderecoPorCEP(e.target.value)}/>
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
          </Form>
        </div>
      ),
    },
    {
      title: "Documentos",
      content: (
        <div style={{ marginTop: "2rem" }}>
          <Form form={form} layout="vertical" initialValues={stepValues}>
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
          </Form>
        </div>
      ),
    },
  ];
  
  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        message.error("CEP não encontrado");
        return;
      }

      form.setFieldsValue({
        uf: data.uf,
        endereco: data.bairro,
        rua: data.logradouro,
        cidade: data.localidade,
      });
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error);
    }
  };

  return (
    <Spin spinning={loading}>
      <h4 style={{ paddingBottom: "1rem" }} className="poppins-bold">
        Cadastrar Ações
      </h4>

      <Steps current={current} items={steps}></Steps>
      <Form form={form} layout="vertical">
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action" style={{ marginTop: 24 }}>
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Anterior
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                const values = form.getFieldsValue();
                console.log("values", values);
                next();
              }}
            >
              Próximo
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => handleCadastrar()}>
              Cadastrar <PlusOutlined />
            </Button>
          )}
        </div>
      </Form>
    </Spin>
  );
}
