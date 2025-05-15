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
  recorrente?: RecorrenciaFormData;
}

export interface ContasForm {
  id?: string;
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
  recorrente?: RecorrenciaFormData;
};

export interface Conta {
  id: number,
  titulo?: string;
  descricao?: string;
  valor?: number;
  data_vencimento?: Date | null;
  status?: string;
  tipo?: string;
  isRecorrente: boolean;
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
  updated_at: Date,
  recorrente?: RecorrenciaFormData;
};

// Tipos para os valores possíveis das strings literais
// export type TipoRecorrencia = 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'personalizada';
export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom' | '';
export type StatusRecorrencia = 'ativa' | 'pausada';

// Interface para os dados do formulário de recorrência
export interface RecorrenciaFormData {
  conta_id: number | string | null | undefined; // O ID da conta à qual a recorrência pertence
  tipo_recorrencia: string;
  intervalo: number | string; // string para permitir campo vazio, mas será convertido para número
  dia_mes?: number | string; // Dia do mês (1-31), opcional e pode ser string do input
  dia_semana?: DiaSemana; // Dia da semana, opcional
  data_inicio: string; // Formato YYYY-MM-DD
  data_fim?: string; // Formato YYYY-MM-DD, opcional
  max_ocorrencias?: number | string; // Opcional, pode ser string do input
  valor?: number | string; // Opcional, pode ser string do input
  status: StatusRecorrencia;
}

// Interface para os erros do formulário
export interface RecorrenciaFormErrors {
  conta_id?: string;
  tipo_recorrencia?: string;
  intervalo?: string;
  dia_mes?: string;
  dia_semana?: string;
  data_inicio?: string;
  data_fim?: string;
  max_ocorrencias?: string;
  valor?: string;
  status?: string;
}

// Interface para as props do componente RecorrenciaFormDialog
export interface RecorrenciaFormDialogProps {
  open: boolean;
  onClose: () => void;
  contaId: number | string | null | undefined; // Deve corresponder ao tipo em RecorrenciaFormData
  onSave: (formData: RecorrenciaFormData) => void; // Função chamada ao salvar
  tipoRecorrencia: string;
  setTipoRecorrencia: (tipoRecorrencia: string) => void;
  intervalo: string;
  setIntervalo: (intervalo: string) => void;
  initialData?: RecorrenciaFormData | null;
}
