import { Navigate } from "react-router";
import Home from "../views/app/home";
import Usuarios from "../views/Cadastros/Usuario";
import Error404 from "../components/404";
import Acoes from "../views/Acoes";
import CadastrarAcoes from "../views/Acoes/CadastrarAcoes";
import Instituicoes from "../views/Cadastros/Instituicao";
import Pessoas from "../views/Cadastros/Pessoas";
import Funcao from "../views/Cadastros/Funcao";
import TiposAcoes from "../views/Cadastros/TipoAcoes";
import VincularEquipeExecucao from "../views/Acoes/VincularEquipeExecucao";
import CadastrarPessoa from "../views/Cadastros/Pessoas/CadastrarPessoa";
import CadastrarInstituicao from "../views/Cadastros/Instituicao/CadastrarInstituicao";
import SemestresLetivos from "../views/Cadastros/Semestre";
import Cursos from "../views/Cadastros/Curso";
import EmitirRelatorio from "../views/Acoes/EmitirRelatorio/EmitirRelatorio"
import GerenciarNiveisAcesso from "../views/GerenciarNiveisAcesso/GerenciarNiveisAcesso";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  permissions: string;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
 // Inicio
 { path: "Calendário", element: <Home />, permissions: "" },

 //Cadastros
 { path: "Cadastros/Usuários", element: <Usuarios />, permissions: "" },
 { path: "Cadastros/Instituições", element: <Instituicoes />, permissions: "" },
 { path: "Cadastros/Instituições/:action", element: <CadastrarInstituicao />, permissions: "" },
 { path: "Cadastros/Pessoas", element: <Pessoas />, permissions: "" },
 
 { path: "Cadastros/Semestres Letivos", element: <SemestresLetivos />, permissions: "" },
 { path: "Cadastros/Pessoas/:action", element: <CadastrarPessoa />, permissions: "" },
 { path: "Cadastros/Funções", element: <Funcao />, permissions: "" },
 { path: "Cadastros/Tipo Ações", element: <TiposAcoes />, permissions: "" },
 { path: "Cadastros/Cursos", element: <Cursos />, permissions: "" },

 //Ações
 { path: "Ações/Buscar Ação", element: <Acoes />, permissions: "" },
 { path: "Ações/Cadastrar Nova Ação", element: <CadastrarAcoes />, permissions: "" },
 { path: "Ações/Emitir Relatório", element: <EmitirRelatorio />, permissions: "" },
 { path: "Eventos/Vincular Equipe de Execução", element: <VincularEquipeExecucao />, permissions: "" },


 { path: "Gerenciar Níveis de Acesso", element: <GerenciarNiveisAcesso />, permissions: "" },
 {
   path: "*",
   permissions: "",
   element: (
     <>
       {" "}
       <Navigate to="/404" replace />
       <Error404 />
     </>
   ),
 },
];

export default routes;
