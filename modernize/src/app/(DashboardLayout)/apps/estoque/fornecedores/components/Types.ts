export interface Fornecedor {
    id: number;
    tipo_pessoa: string;
    nome: string;
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
    produtos_fornecidos: [];
    created_at: Date;
    updated_at: Date;
}

export interface FornecedorForm {
    tipo_pessoa: string;
    nome: string;
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
    produtos_fornecidos: Produto[];
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