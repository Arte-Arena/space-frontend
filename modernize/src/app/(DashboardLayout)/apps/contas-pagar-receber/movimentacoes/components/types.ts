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
