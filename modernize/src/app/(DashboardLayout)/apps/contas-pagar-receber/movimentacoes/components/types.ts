import { DetalhesTransacaoMP } from "./datalhesTypes";

export interface Parcela {
  numero: number;
  data: string;
  status: string;
  valor: number;
}

export interface MovimentacaoFinanceira {
  id: number;
  orcamento_id?: number;
  orcamento_status_id?: number;
  pedido_arte_final_id?: number;
  carteira_id?: number;
  conta_id?: number;
  estoque_id?: number;
  fornecedor_id?: number;
  cliente_id?: number;
  categoria_id?: number;
  origin_type?: string;
  origin_id?: number;
  numero_pedido: string;
  documento: string;
  tipo_documento: string;
  valor_bruto: number;
  valor_liquido: number;
  data_operacao: string;
  data_lancamento: string;
  tipo: string;
  etapa: string;
  status: string;
  observacoes?: string;
  lista_produtos?: any[];
  metadados_cliente?: any;
  metadados?: {
    forma_pagamento?: string;
    tipo_faturamento?: string;
    parcelas?: Parcela[];
    [key: string]: any;
  };
}


// pagina de detalhes
export interface Produto {
  id: number;
  nome: string;
  peso: string;
  type: string;
  prazo: number;
  preco: number;
  altura: string;
  largura: string;
  created_at: string | null;
  quantidade: number;
  updated_at: string | null;
  comprimento: string;
}

export interface ParcelaDetails {
  numero: number;
  data: string;
  valor: string;
  status: 'pago' | 'pendente';
}

export interface MetadadosCliente {
  cliente_octa_number: string;
}

export interface Metadados {
  forma_pagamento: string;
  tipo_faturamento: string;
  parcelas: Parcela[];
}
export interface MetadadosDetails {
  forma_pagamento: string;
  tipo_faturamento: string;
  parcelas: ParcelaDetails[];
}

export interface MovimentacaoFinanceiraDetails {
  id: number;
  pedido_arte_final_id: number | null;
  orcamento_id: number;
  orcamento_status_id: number;
  carteira_id: number | null;
  conta_id: number | null;
  estoque_id: number | null;
  fornecedor_id: number | null;
  cliente_id: number | null;
  categoria_id: number | null;
  origin_type: string;
  origin_id: number;
  numero_pedido: string;
  documento: string;
  tipo_documento: string;
  valor_bruto: string;
  valor_liquido: string;
  data_operacao: string;
  data_lancamento: string;
  tipo: 'entrada' | 'saida';
  etapa: string;
  status: string;
  observacoes: string | null;
  lista_produtos: Produto[];
  metadados_cliente: MetadadosCliente;
  metadados: MetadadosDetails;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Payer {
  id: string;
  type: string | null;
  email: string | null;
  phone: {
    number: string | null;
    area_code: string | null;
    extension: string | null;
  };
  last_name: string | null;
  first_name: string | null;
  entity_type: string | null;
  operator_id: string | null;
  identification: {
    type: string | null;
    number: string | null;
  };
}

export interface TransacaoBancariaDetails {
  id: number;
  carteira_id: number;
  movimentacao_financeira_id: number | null;
  id_transacao_externa: string;
  data_transacao: string;
  data_lancamento: string;
  tipo_operacao: 'entrada' | 'saida';
  descricao: string;
  valor: string;
  valor_taxas: string;
  tipo: string;
  categoria: string;
  status: string;
  detalhes: DetalhesTransacaoMP;
  conciliado: boolean;
  plataforma: string;
  fonte_dados: string;
  valor_liquido: number;
  documento_pagador: string | null;
  nome_pagador: string | null;
  email_pagador: string | null;
  chave_conciliacao: string;
  created_at: string;
  updated_at: string;
  porcentagem_semelhanca?: number; // Adicionado para a conciliação
}

export interface ApiResponseDetails {
  movimentacao: MovimentacaoFinanceira;
  transacoes_parecidas?: TransacaoBancariaDetails[];
  meta?: {
    total_transacoes_parecidas: number;
    margem_percentual: number;
  };
}