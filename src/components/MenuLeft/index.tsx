import React, { useEffect, useState } from "react";
import {
  BankOutlined,
  BarChartOutlined,
  CalendarOutlined,
  DesktopOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  IdcardOutlined,
  PlayCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./styles.css";
import { Menu } from "antd";

import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css"
import { BsPeople } from "react-icons/bs";

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

const items: MenuProps["items"] = [
  //getItem("Calendário", "inicio", <CalendarOutlined  />, "/Calendário"),

  getItem("Cadastros", "cadastros", <FileTextOutlined />, "/Consultas", [
    getItem("Curso", "cursos", <DesktopOutlined />, "Cadastros/Cursos"),
    getItem("Função", "funcao", <IdcardOutlined />, "Cadastros/Funções"),
    getItem("Instituição","instituicao",<BankOutlined />,"Cadastros/Instituições"),
    getItem("Pessoas", "pessoas", <TeamOutlined />, "Cadastros/Pessoas"),
    getItem("Semestre Letivos","semestre",<CalendarOutlined />,"Cadastros/Semestres Letivos" ),
    getItem("Tipo Ação","tipoAcao",<FileTextOutlined />,"Cadastros/Tipo Ações"),
  ]),
  getItem("Ações", "acoes", <PlayCircleOutlined  />, "/Consultas", [
    getItem("Nova Ação", "novaAcao", <DesktopOutlined  />, "/Ações/Cadastrar Nova Ação"),
    getItem("Emitir Relatórios", "emitirRelatorios", <FileSearchOutlined  />, "Ações/Emitir Relatório"),
    getItem("Buscar Ação", "consultarAcao", <BarChartOutlined  />, "/Ações/Buscar Ação"),
    getItem("Consultar Participantes", "consultarParticipantes", <BsPeople  />, "/Ações/Consultar Ação"),
  ]),
  getItem("Gerenciar Nívies de Acesso", "niveisAcesso", <SafetyOutlined />,"/Gerenciar Níveis de Acesso"),
];

function MenuLeft({ isIconClicked }: any) {
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;

    const selectedItem = items?.find((item: any) =>
      currentPath.startsWith(item.uri || "")
    );

    if (selectedItem) {
      setDefaultSelectedKeys([selectedItem?.key?.toString()]);
    } else {
      setDefaultSelectedKeys([""]);
    }
  }, [location.pathname, navigate]);

  function encontrarItemDoMenu(items: any[], targetKey: React.Key): void {
    let selectedItem: any = null;
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
    var selectedItem: any = encontrarItemDoMenu(items ? items : [], e.key);
    if (selectedItem && selectedItem.uri) {
      navigate(selectedItem.uri);
    }
  };

  return (
    <div style={{ overflow: "auto",}}>
      {defaultSelectedKeys && defaultSelectedKeys.length > 0 && (
        <div
          style={{
            height: "calc(100% - 6rem)",
            overflow: "auto",
            width: "100%",
          }}
        >
          <Menu
            mode="inline"
            onClick={onClick}
            style={{ height: "90%" }}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={["sub1"]}
            inlineCollapsed={!isIconClicked}
            items={items}
            
            
          />
        </div>
      )}
    </div>
  );
}

export default MenuLeft;
