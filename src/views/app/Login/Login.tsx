import { useState } from "react";
import { Form, Input, Button } from "antd";
import { Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import loginSvg from "../../../assets/images/login.svg";
import ifes from "../../../assets/images/LogoLeter_LetraPreta-removebg-preview.png";
import { login } from "../../../features/authSlice";
import { post } from "../../../api/axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
 

  const handleLogin = async () => {
    try {
      setLoading(true)
      const params = {
        login: "",
        password: ""
      }

      const response = await post("/", params)

      console.log('Login Efetuado!:', response);
      console.log('response', response)
      dispatch(login({
        token: response
      }));

  
    } catch (error) {
      console.error('Login failed:', error);
      
    } finally {
      setLoading(false)
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FEAE05",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 800, textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <div style={{ width: "50%" }}>
            <img
              src={ifes}
              alt="Imagem"
              style={{ maxWidth: "100%", height: 100, position: "relative", bottom: 25}}
            />
            <div>
              <h4 className="poppins-bold" style={{fontSize: 30, position: "relative", bottom: 12}}>Seja Bem-vindo</h4>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              onFinishFailed={() => {}}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Usuário" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Senha"
                />
              </Form.Item>

              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "50%" }}
                >
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={loginSvg} alt="Imagem" style={{ maxWidth: "100%" }} />
          </div>
        </div>
      </Card>

      
    </div>
  );
};

export default Login;
