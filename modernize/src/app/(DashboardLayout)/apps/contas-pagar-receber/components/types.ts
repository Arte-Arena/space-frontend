// types.ts
export interface Parcela {
    parcela: number;
    data: string;
    status: string;
    valor: number;
  }
  
  export interface ContaFormProps {
    initialValues?: ContasForm,
    onSubmit: (values: any) => void;
    submitLabel?: string;
  }
  
  export interface ContasForm {
      titulo?: string;
      descricao?: string;
      valor?: number;
      data_vencimento?: Date | null;
      status?: string;
      tipo?: string;
      parcelas?: Parcela[];
      data_pagamento?: Date | null;
      data_emissao?: Date | null;
      forma_pagamento?: string;
      orcamento_staus_id?: string;
      estoque_id?: string;
      estoque_quantidade?: string;
      recorrencia?: string;
      fixa?: boolean;
      documento?: string;
      observacoes?: string;
    };
  
  export interface Conta {
      id: number,
      titulo?: string;
      descricao?: string;
      valor?: number;
      data_vencimento?: Date | null;
      status?: string;
      tipo?: string;
      parcelas?: Parcela[];
      data_pagamento?: Date | null;
      data_emissao?: Date | null;
      forma_pagamento?: string;
      orcamento_staus_id?: string;
      estoque_id?: string;
      estoque_quantidade?: string;
      recorrencia?: string;
      fixa?: boolean;
      documento?: string;
      observacoes?: string;
      created_at: Date;
      updated_at:Date,
    };
  