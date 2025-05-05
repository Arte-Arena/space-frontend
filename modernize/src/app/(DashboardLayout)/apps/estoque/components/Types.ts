export interface Fornecedor {
  id: number;
  tipo_pessoa: string;
  nome_completo: string;
  rg: string;
  cpf: string;
  razao_social: string;
  cnpj: string;
  inscricao_estadual: string;
  email: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  produtos: Produto[];
  created_at: Date;
  updated_at: Date;
}

export interface FornecedorForm {
  tipo_pessoa: string;
  nome_completo: string | null;
  rg: string | null;
  cpf: string | null;
  razao_social: string | null;
  cnpj: string | null;
  inscricao_estadual: string | null;
  email: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  produtos: Produto[];
}

export interface Produto {
  id: number;
  nome: string | null;
  preco: number;
  quantidade: number;
  prazo: number;
  peso: number;
  comprimento: number;
  largura: number;
  altura: number;
  type: string;
}

export interface ProdutoForm {
  id: number;
  nome: string | null;
  type: string;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}


export interface Estoque {
  id: number;
  nome: string;
  descricao: string;
  quantidade: number;
  estoque_min: number;
  estoque_max: number;
  variacoes: Variacoes[];
  fornecedores: Fornecedor[];
  unidade_medida: string;
  categoria: string;
  produto_id: number;
  produto_table: string;
  preco_produto: string;
  created_at: Date;
  updated_at: Date;
}

export interface EstoqueData {
  nome: string;
  descricao: string;
  variacoes: Variacoes[];
  unidade_medida: string;
  quantidade: number;
  estoque_min: number;
  estoque_max: number;
  categoria: string;
  fornecedores: Fornecedor[];
  produto_id: number | '';
  produto_table: string;
  produtos?: Produto[];
}


export interface Variacoes {
  color: string;
  material: string;
  tamanhos: string;
  franjas:  string;
  altura: string;
  largura: string;
  preco: string;
} 