export interface Column {
  id: number;
  name: string;
  type: string;
  options?: string[];
}

export interface TableRow {
  id: number;
  data: string[];
  confirmed: boolean;
}

export interface TableData {
  [key: string]: TableRow[];
}

export interface UniformData {
  id: number;
  orcamento_id: number;
  esboco: string;
  quantidade_jogadores: number;
  configuracoes: Array<{
    genero: 'M' | 'F' | 'I';
    nome_jogador: string;
    numero: string;
    tamanho_camisa: string;
    tamanho_shorts: string;
  }>;
}