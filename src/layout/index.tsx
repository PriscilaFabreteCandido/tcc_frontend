import { Outlet } from "react-router-dom";

import "./styles.css";
import Breadcrumbs from "../components/Breadcrumbs";
import MenuLeft from "../components/MenuLeft";
import ifes from "../assets/images/LogoLeter_LetraPreta-removebg-preview.png";
import logo from "../assets/images/cubo.svg";

import { useEffect, useState } from "react";
import Layout, { Content, Header } from "antd/es/layout/layout";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, Space, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { colors } from "../global/theme/theme";
import { AiOutlineDown } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { logout, updateUserInfo } from "../features/authSlice";
import SessionService from "../services/SessionService";
import ApiService from "../services/ApiService";

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {token: { colorBgContainer, borderRadiusLG },} = theme.useToken();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<any>(new SessionService().getUserInfo());
  const apiService: ApiService = new ApiService();


  function sairAplicacao(){
    dispatch(logout())
  }

  const getUserInfo = async () => {
    console.log('userInfo', userInfo, userInfo?.pessoa)
    if(!userInfo){
      const res = await apiService.get('/usuarios/info')
      dispatch(updateUserInfo({nome: res.pessoa.nome}))
      setUserInfo({nome: res.pessoa.nome})
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {sairAplicacao() }}>
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: "100vh" }} >
      <Sider className="seu-elemento" trigger={null} collapsible collapsed={collapsed} width={300} style={{ background: "white" }} >
        {/* <div className="demo-logo-vertical" /> */}
        <div
          style={{
            width: "100%",
            height: 100,
            padding: !collapsed ? "24px 16px" : "10px",
            display: "flex", // Adiciona display: flex para alinhar verticalmente
            alignItems: "center", // Alinha o conteúdo verticalmente ao centro
          }}
          className="logo"
        >
          <img
            src={!collapsed ? ifes : logo}
            alt="Descrição da imagem"
            style={{
              width: "100%",
              height: "auto", // Alterado para "auto" para manter a proporção da imagem
              objectFit: "cover",

            }}
          />
        </div>

        <MenuLeft />
      </Sider>

      <Layout >
        <Header
          style={{ padding: "0 2rem", background: colors.secundary }}
          className="shadow"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              type="text"
              icon={
                collapsed ? <MenuUnfoldOutlined style={{ color: 'white' }} /> : <MenuFoldOutlined style={{ color: 'white' }} />
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                position: "relative",
                right: 15
              }}
            />
            <Space style={{display: "flex", alignItems: "center", gap: 15}}>
              <Avatar style={{ backgroundColor: '#fff' }} icon={<UserOutlined style={{color: colors.secundary}}/>} />

              <span style={{ color: 'white' }}>{userInfo?.nome}</span>

              <Dropdown overlay={menu} trigger={['click']} >
                <Avatar style={{ backgroundColor: colors.secundary }} icon={<AiOutlineDown />} />
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Breadcrumbs />
        <Content
          className="shadow"
          style={{
            margin: "0px 2rem 10px 2rem",
            padding: 24,
            minHeight: "80vh",
            overflow: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default RootLayout;
