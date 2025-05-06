import dayjs, { Dayjs } from 'dayjs';

export interface Estoque {
  id: number;
  nome: string;
  descricao: string;
  variacoes: string[];
  unidade_medida: string;
  quantidade: number;
  estoque_min: number;
  estoque_max: number;
  categoria: string;
  fornecedores: number[];
  produto_id: number;
  produto_table: string;
}

export interface Fornecedor {
  id: number;
  nome_completo: string;
}

export interface MovimentacaoFormData {
  estoque_id: number;
  data_movimentacao: Dayjs | null;
  tipo_movimentacao: 'entrada' | 'saida';
  documento: string;
  numero_pedido: string;
  fornecedor_id: number;
  localizacao_origem: string;
  quantidade: string;
  observacoes: string;
}

export interface Movimentacao {
  id: number;
  estoque_id: number;
  data_movimentacao: Date | string | null;
  tipo_movimentacao: 'entrada' | 'saida';
  documento: string;
  numero_pedido: string;
  fornecedor_id: number;
  localizacao_origem: string;
  quantidade: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}
