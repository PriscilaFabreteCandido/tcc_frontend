
export interface ItensBreadcrumbs {
  path: string;
  label: string;
  children?: ItensBreadcrumbs[];
}

const itensBreadcrumbs: ItensBreadcrumbs[] = [
  { path: "/Inicio", label: "Inicio" },
  {
    path: "",
    label: "Inicio",
    children: [
      {
        path: "Cadastros/Usuário",
        label: "Inicio",
        children: [{ path: "Cadastros/Usuário/Cadastro", label: "Inicio" }],
      },
    ],
  },
  { path: "Consultas", label: "Consultas" },
  { path: "PGR", label: "PGR" },
  { path: "PCMSO", label: "PCMSO" },
  {
    path: "",
    label: "PCMSO",
    children: [{ path: "PCMSO/Cadastro", label: "Cadastro" }],
  },
  { path: "Relatórios", label: "Inicio" },
  { path: "Perguntas Frequentes", label: "Inicio" },
];

export default itensBreadcrumbs;
