
interface Movimentacao {
  origin_type: string;
  origin_id: number;
  numero_pedido: string;
  documento: string;
  tipo_documento: string;
  valor_bruto: string;
  valor_liquido: string;
  data_operacao: string;
  status: string;
}

interface Transacao {
  id_transacao_externa: string;
  data_transacao: string;
  valor: string;
  valor_taxas: string;
  tipo_operacao: string;
  status: string;
  nome_pagador: string;
  email_pagador: string;
  documento_pagador: string;
}

interface Conciliacao {
  id: number;
  status: string;
  diferenca: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
  movimentacao: Movimentacao;
  transacao: Transacao;
}