import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Tooltip,
  Modal,
  Form,
  message,
  Popconfirm,
  Select,
  Space
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { CardFooter } from "../../../components/CardFooter";
import { ColumnsType } from "antd/es/table";
import { get, post, put, remove } from "../../../api/axios";
import moment from "moment";


interface PeriodoAcademicoType {
  key: React.Key;
  id: number;
  ano: number;
  dataInicio: string;
  dataFim: string;
  formato: string;
  periodo: string;
}

const SemestresLetivos: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [periodoToEdit, setPeriodoToEdit] = useState<PeriodoAcademicoType | null>(null);
  const [periodos, setPeriodos] = useState<PeriodoAcademicoType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [formato, setFormato] = useState<string | undefined>(undefined);

  const showModal = () => {
    setIsOpenModal(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setPeriodoToEdit(null);
    setIsOpenModal(false);
  };

  const handleFormatoChange = (value: string) => {
    setFormato(value);
    // Limpar o valor do campo "Período" se o formato for "SEMESTRAL"
    if (value === 'SEMESTRAL') {
      form.setFieldsValue({ periodo: '' });
    }
  };
  

  const getPeriodos = async () => {
    setLoading(true);
    try {
      const response: PeriodoAcademicoType[] = await get("periodos");
      setPeriodos(response);
    } catch (error) {
      console.error("Erro ao obter períodos acadêmicos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPeriodos();
  }, []);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      const periodoData = {
        ano: values.ano,
        dataInicio: values.dataInicio,
        dataFim: values.dataFim,
        formato: values.formato,
        periodo: values.periodo,
        id: periodoToEdit ? periodoToEdit.id : null,
      };

      if (!periodoToEdit) {
        const response = await post("periodos/create", periodoData);
        setPeriodos([...periodos, response]);
        message.success("Período acadêmico criado com sucesso");
      } else {
        const response = await put(`periodos/update/${periodoToEdit.id}`, periodoData);
        setPeriodos(periodos.map(periodo => (periodo.id === response.id ? response : periodo)));
        message.success("Período acadêmico editado com sucesso");
      }

      handleCancel();
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await remove(`periodos/delete/${id}`);
      setPeriodos(periodos.filter(periodo => periodo.id !== id));
      message.success("Período acadêmico excluído com sucesso");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        showError("Erro ao processar o formulário: " + error.response.data.message);
      }
      console.error("Erro ao excluir período acadêmico:", error);
    }
  };

  const showError = (errorMessage: string) => {
    message.error(errorMessage);
  };


  const columns: ColumnsType<PeriodoAcademicoType> = [
    {
      title: "Ano",
      dataIndex: "ano",
      sorter: (a, b) => a.ano - b.ano,
    },
    {
      title: "Data de Início",
      dataIndex: "dataInicio",
      render: (dataInicio) => moment(dataInicio).format("DD/MM/YYYY")
    },
    {
      title: "Data de Fim",
      dataIndex: "dataFim",
      render: (dataFim) => moment(dataFim).format("DD/MM/YYYY")
    },
    {
      title: "Formato",
      dataIndex: "formato",
    },
    {
      title: "Período",
      dataIndex: "periodo",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
        <Tooltip title="Editar">
        <Button
          className="ifes-btn-warning"
          shape="circle"
          onClick={() => {
            setPeriodoToEdit(record);
            form.setFieldsValue({
              ano: record.ano,
              formato: record.formato,
              periodo: record.periodo,
              dataInicio: record.dataInicio,
              dataFim: record.dataFim,
            });
            setIsOpenModal(true);
            setFormato(record.formato); // Definindo o formato ao editar
          }}
        >
          <EditOutlined className="ifes-icon" />
        </Button>
      </Tooltip>

          <Tooltip title="Excluir">
            <Popconfirm
              title="Tem certeza que deseja excluir este período acadêmico?"
              onConfirm={() => onDelete(record.id)}
              okText="Sim"
              cancelText="Cancelar"
            >
              <Button
                className="ifes-btn-danger"
                shape="circle"
                onClick={() => {}}
              >
                <DeleteOutlined className="ifes-icon" />
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <>
      {/* Header */}
      <CardFooter>
        <div className="flex justify-content-between">
          {/* Filtros */}
          <div className="flex filtros-card"></div>

          <div>
            <Button value="large" type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </div>
        </div>
      </CardFooter>

      {/* Tabela */}
      <Table columns={columns} dataSource={periodos} loading={loading} />

      {/* Modal */}
      <Modal
        title="Adicionar Período Acadêmico"
        visible={isOpenModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ano"
            label="Ano"
            rules={[{ required: true, message: "Por favor, insira o ano!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="formato"
            label="Formato"
            rules={[{ required: true, message: "Por favor, insira o formato!" }]}
          >
            <Select onChange={handleFormatoChange}>
              <Select.Option value="ANUAL">Anual</Select.Option>
              <Select.Option value="SEMESTRAL">Semestral</Select.Option>
            </Select>
          </Form.Item>
          {formato === "SEMESTRAL" && (
            <>
              <Form.Item
                name="periodo"
                label="Período"
                rules={[{ required: true, message: "Por favor, insira o período!" }]}
              >
                <Select>
                  <Select.Option value="1">1º Semestre</Select.Option>
                  <Select.Option value="2">2º Semestre</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item
            name="dataInicio"
            label="Data de Início"
            rules={[{ required: true, message: "Por favor, insira a data de início!" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="dataFim"
            label="Data de Fim"
            rules={[{ required: true, message: "Por favor, insira a data de fim!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SemestresLetivos;