import React, { useState } from "react";
import "./styles.css";
import {
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,

  SecurityScanOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Menu, MenuProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { useNavigate } from "react-router";

interface MenuItem {
  key: React.Key;
  uri?: string | "";
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  uri?: string | "",
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    uri: uri || "",
  };
}

const itemsMenu: MenuProps["items"] = [
  getItem("Sair da Aplicação", "sair", <LogoutOutlined />, "/Login"),
  getItem("Segurança", "seguranca", <SecurityScanOutlined />, "/Seguranca", [
    getItem(
      "Redefinir Senha",
      "redefinirSenha",
      <FormOutlined />,
      "/RedefinirSenha"
    ),
    
  ]),
];

function Header({ onIconClick }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    onIconClick(!collapsed);
  };

  


  function encontrarItemDoMenu(items: any[], targetKey: React.Key): void {
    var selectedItem: any = null;
    if (!items || items.length <= 0) return;

    for (const item of items) {
      if (item.key === targetKey) {
        selectedItem = item;
        return selectedItem;
      }

      if (item.children && item.children.length > 0) {
        selectedItem = encontrarItemDoMenu(item.children, targetKey);
        if (selectedItem) return selectedItem;
      }
    }
  }

  const onClick: MenuProps["onClick"] = (e) => {
    var selectedItem: any = encontrarItemDoMenu(
      itemsMenu ? itemsMenu : [],
      e.key
    );
    if (selectedItem && selectedItem.uri) {
      navigate(selectedItem.uri);
    }
  };

  return (
    <>
      <div
        className="header-senai flex"
        style={{ justifyContent: "space-between", padding: "0 1.85rem" }}
      >
        <div>
          <Button onClick={toggleCollapsed} className="transparent-button">
            {!collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: "16px", color: "white" }}
              />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "16px", color: "white" }} />
            )}
          </Button>
        </div>


        <div className="flex gap-1">
          {/* Informações do Usuário */}

          <Avatar className="white-icon" size={24} icon={<UserOutlined />}  style={{ 
            margin: "0", position: "relative",
              top: "18px",
              left: "-1px",}}/>

          <div className="cor-white info-user flex flex-column btn-info-user">
            <h6 className="font-14" style={{ margin: "0", position: "relative",
              top: "12px",
              left: "-1px",}}>
              Administrador
            </h6>
          </div>

          {/* Botão de Ação Adicional (se aplicável) */}
          {/* Separador */}
          <div className="separador"></div>

          <Button
            onClick={() => setMenuVisible(!menuVisible)}
            style={{
              background: "transparent",
              padding: "0rem",
              border: "none",
              position: "relative",
              top: "16px",
              left: "-1px",
            }}
          >
            <SettingOutlined style={{ fontSize: "1.2rem", color: "white" }} />
          </Button>
        </div>

      </div>

      {menuVisible && (
        <Menu
          onClick={onClick}
          className="menu-content"
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={itemsMenu}
        ></Menu>
      )}
    </>
  );
}

export default Header;
