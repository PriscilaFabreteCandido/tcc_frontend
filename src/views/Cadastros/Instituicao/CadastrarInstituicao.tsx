import React, { useEffect } from "react";
import { Button, Form, Input, Select,  message } from "antd";
import { useLocation, useNavigate } from "react-router";

import {  post, put } from "../../../api/axios";
import { tipoInstituicoes } from "../../../data/tipoInstituicoes";

const CadastrarInstituicao = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate() as any;
  

  const { instituicao } = location.state || {};

  React.useEffect(() => {
    if (instituicao) {
      form.setFieldsValue({
        nome: instituicao.nome,
        cep: instituicao.cep,
        estado: instituicao.estado,
        bairro: instituicao.bairro,
        rua: instituicao.rua,
        numero: instituicao.numero,
        descricao: instituicao.descricao,
        email: instituicao.email,
        telefone: instituicao.telefone,
        tipoInstituicao: instituicao.tipoInstituicao,
      });
    }
  }, [instituicao, form]);

  useEffect(() => {
  }, []);

  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        message.error("CEP não encontrado");
        return;
      }

      form.setFieldsValue({
        estado: data.uf,
        bairro: data.bairro,
        rua: data.logradouro,
      });
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error);
    }
  };

  const handleCancelar = () => {
    // Adicione aqui a lógica para cancelar
    console.log("Operação cancelada!");
  };

  
  const handleCancel = () => {
    form.resetFields();
  };

  const handleCadastrar = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const instituicaoToCreateOrEdit = {
        nome: values.nome,
        id: instituicao ? instituicao.id : null,
        cep: values.cep,
        estado: values.estado,
        bairro: values.bairro,
        rua: values.rua,
        numero: values.numero,
        descricao: values.descricao,
        email: values.email,
        telefone: values.telefone,
        tipoInstituicao:  values.tipoInstituicao
        
      };

      if (!instituicao) {
        await post("instituicoes/create", instituicaoToCreateOrEdit);
        navigate("/Cadastros/Instituições");
        message.success("Instituição criada com sucesso");
      } else {
        await put(
          `instituicoes/update/${instituicao.id}`,
          instituicaoToCreateOrEdit
        );
        navigate("/Cadastros/Instituições");
        message.success("Instituição editada com sucesso");
      }

      handleCancel();
    } catch (error: any) {
     
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: "20px" }}>
          <h4 className="poppins-bold">Dados da Instituição</h4>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item
                name="nome"
                label="Nome"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o nome da instituição!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item
                name="cep"
                label="CEP"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o CEP da instituição!",
                  },
                ]}
              >
                <Input placeholder="00000-00" onChange={(e) => buscarEnderecoPorCEP(e.target.value)} />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="estado"
                label="UF"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o estado da instituição!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item
                name="bairro"
                label="Bairro"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o bairro da instituição!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item
                name="rua"
                label="Rua"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira a rua da instituição!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="numero"
                label="Número"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o número da instituição!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>

          
          <div style={{ display: "flex", marginBottom: "20px" }}>
          <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item
                name="tipoInstituicao"
                label="Tipo de Instituição"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecione o tipo de instituição!",
                  },
                ]}
              >
                <Select showSearch>
                  {tipoInstituicoes.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div style={{ flex: 1, marginRight: "10px" }}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </div>
            <div style={{ flex: 1}}>
              <Form.Item name="telefone" label="Telefone">
                <Input />
              </Form.Item>
            </div>
            
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Form.Item
              name="descricao"
              label="Descrição"
            >
              <Input.TextArea />
            </Form.Item>
          </div>
        </div>
      </Form>

      <div style={{ display: "flex", justifyContent: "end", gap: 16 }}>
        <Button type="default" onClick={handleCancelar} >
          Cancelar
        </Button>
        <Button type="primary" onClick={handleCadastrar}>
          {instituicao ? "Editar": "Cadastrar"}
        </Button>
      </div>
    </div>
  );
};

export default CadastrarInstituicao;
