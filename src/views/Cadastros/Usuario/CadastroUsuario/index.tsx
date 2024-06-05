import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from "antd";

import "../styles.css";
import { CardCadastro } from "../../../../components/CardCadastro";
import {
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function UsuarioCadastro() {
  const [form] = Form.useForm();

  return (
    <>
      <h3 style={{ paddingBottom: "1rem" }}>Cadastrar Novo Exame</h3>
      <Form form={form} name="userForm" initialValues={{ remember: true }}>
        <div className="flex gap-1 usuario-container">
          <CardCadastro
            titulo="Informações Pessoais"
            icone={<UserOutlined />}
            style={{ width: "55%" }}
          >
            <Form.Item
              label="Nome Completo"
              name="nomeCompleto"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o nome completo!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Supervisor"
              name="supervisor"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o nome do supervisor!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Tooltip title="Telefone Principal">
                      <span style={{ maxWidth: "100%" }}>Tel. Principal</span>
                    </Tooltip>
                  }
                  name="telefonePrincipal"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira o telefone principal!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item
                  label="Especialidades"
                  name="especialidades"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira as especialidades!",
                    },
                  ]}
                >
                  <Select>
                    <Option value="EST">
                      Engenheiro de Segurança do Trabalho
                    </Option>
                    <Option value="EE">Engenheiro Eletricista</Option>
                    <Option value="EM">Engenheiro Mecânico</Option>
                    <Option value="ET">Médico do Trabalho</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Nacionalidade"
              name="nacionalidade"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a nacionalidade!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </CardCadastro>
        </div>

        <div className="footer-cadastro">
          <Tooltip title="Cancelar">
            <Button className="ifes-btn-warning" icon={<CloseOutlined />}>
              Cancelar
            </Button>
          </Tooltip>

          <Tooltip title="Salvar">
            <Button className="ifes-btn-success" icon={<SaveOutlined />}>
              Salvar
            </Button>
          </Tooltip>
        </div>
      </Form>
    </>
  );
}
