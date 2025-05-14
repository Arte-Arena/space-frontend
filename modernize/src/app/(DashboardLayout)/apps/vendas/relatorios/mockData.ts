export const clientesData = {
  novosMensais: [25, 40, 30, 45, 55, 42, 35, 50, 45, 60, 55, 65],
  tempoFechamento: {
    labels: ["<15 dias", "15-30 dias", "30-60 dias", ">60 dias"],
    data: [35, 25, 20, 20],
  },
};

export const orcamentosData = {
  vendasConvertidas: {
    total: 120,
    percentual: 65,
    anterior: 110,
    crescimento: 9.1,
  },
  valorTotal: {
    atual: 278500,
    anterior: 245000,
    crescimento: 13.7,
  },
  vendasPorSegmento: {
    labels: [
      "Atlética/Interclasse",
      "Times",
      "Pessoa Jurídica",
      "Agências/Marketing",
      "Outros",
    ],
    data: [35, 25, 20, 15, 5],
  },
  vendaValorPorSegmento: {
    labels: [
      "Atlética/Interclasse",
      "Times",
      "Pessoa Jurídica",
      "Agências/Marketing",
      "Outros",
    ],
    data: [95000, 68500, 75000, 35000, 5000],
  },
  historicoMensal: [
    { mes: "Jan", valor: 18500 },
    { mes: "Fev", valor: 21000 },
    { mes: "Mar", valor: 19800 },
    { mes: "Abr", valor: 22500 },
    { mes: "Mai", valor: 20700 },
    { mes: "Jun", valor: 23800 },
    { mes: "Jul", valor: 25400 },
    { mes: "Ago", valor: 27900 },
    { mes: "Set", valor: 31200 },
    { mes: "Out", valor: 28700 },
    { mes: "Nov", valor: 30000 },
    { mes: "Dez", valor: 33000 },
  ],
};

export const desempenhoData = {
  vendasPessoais: {
    total: 85,
    percentual: 70.8,
    anterior: 75,
    crescimento: 13.3,
  },
  valorTotalPessoal: {
    atual: 195000,
    anterior: 172000,
    crescimento: 13.4,
  },
  taxaConversaoPessoal: {
    atual: 68,
    anterior: 62,
    crescimento: 9.7,
  },
  orcamentosPorStatus: {
    labels: ["Aprovados", "Em análise", "Aguardando cliente", "Cancelados"],
    data: [42, 28, 18, 12],
  },
  topClientes: [
    { nome: "Atlética Medicina USP", valor: 32500, orcamentos: 3 },
    { nome: "Time Futebol FC", valor: 28700, orcamentos: 2 },
    { nome: "Empresa XYZ Ltda", valor: 25000, orcamentos: 1 },
    { nome: "Agência ABC Marketing", valor: 22800, orcamentos: 2 },
    { nome: "Interclasse Colégio São Paulo", valor: 18500, orcamentos: 1 },
  ],
  meusOrcamentos: [
    { id: "ORC-2023-0042", cliente: "Atlética Medicina USP", valor: 15800, data: "2023-11-15", status: "Aprovado" },
    { id: "ORC-2023-0051", cliente: "Atlética Medicina USP", valor: 9200, data: "2023-11-22", status: "Aprovado" },
    { id: "ORC-2023-0057", cliente: "Time Futebol FC", valor: 18700, data: "2023-11-28", status: "Aprovado" },
    { id: "ORC-2023-0063", cliente: "Empresa XYZ Ltda", valor: 25000, data: "2023-12-05", status: "Em análise" },
    { id: "ORC-2023-0068", cliente: "Agência ABC Marketing", valor: 12800, data: "2023-12-10", status: "Aguardando cliente" },
    { id: "ORC-2023-0072", cliente: "Interclasse Colégio São Paulo", valor: 18500, data: "2023-12-15", status: "Em análise" },
    { id: "ORC-2023-0079", cliente: "Time Futebol FC", valor: 10000, data: "2023-12-20", status: "Aprovado" },
    { id: "ORC-2024-0005", cliente: "Agência ABC Marketing", valor: 10000, data: "2024-01-08", status: "Cancelado" },
    { id: "ORC-2024-0012", cliente: "Empresa ABC Ltda", valor: 14500, data: "2024-01-15", status: "Em análise" },
    { id: "ORC-2024-0018", cliente: "Atlética Engenharia", valor: 22000, data: "2024-01-22", status: "Aguardando cliente" }
  ],
  historicoMensal: [
    { mes: "Jan", valor: 12500, orcamentos: 6 },
    { mes: "Fev", valor: 15000, orcamentos: 8 },
    { mes: "Mar", valor: 13800, orcamentos: 7 },
    { mes: "Abr", valor: 16500, orcamentos: 9 },
    { mes: "Mai", valor: 14700, orcamentos: 7 },
    { mes: "Jun", valor: 17800, orcamentos: 10 },
    { mes: "Jul", valor: 18400, orcamentos: 11 },
    { mes: "Ago", valor: 19900, orcamentos: 12 },
    { mes: "Set", valor: 21200, orcamentos: 13 },
    { mes: "Out", valor: 19700, orcamentos: 12 },
    { mes: "Nov", valor: 21000, orcamentos: 13 },
    { mes: "Dez", valor: 24000, orcamentos: 15 },
  ],
};
