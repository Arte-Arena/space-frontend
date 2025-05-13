export interface Transaction {
  id: number;
  carteira_id: number;
  movimentacao_financeira_id: number | null;
  id_transacao_externa: string | null;
  data_transacao: string;
  data_lancamento: string;
  descricao: string;
  valor: string;
  tipo: string;
  tipo_operacao: string;
  categoria: string | null;
  status: 'pendente' | 'conciliado' | 'cancelado';
  detalhes: any | null;
  conciliado: boolean;
  plataforma: string | null;
  fonte_dados: string | null;
  valor_liquido: string | null;
  valor_taxas: string | null;
  documento_pagador: string | null;
  nome_pagador: string | null;
  email_pagador: string | null;
  chave_conciliacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionMP {
  id: number;
  carteira_id: number;
  movimentacao_financeira_id: number | null;
  id_transacao_externa: string | null;
  data_transacao: string;
  data_lancamento: string;
  descricao: string;
  valor: string;
  tipo: string;
  tipo_operacao: string;
  categoria: string | null;
  status: 'pendente' | 'conciliado' | 'cancelado';
  detalhes: TransactionDetalhesMP | null;
  conciliado: boolean;
  plataforma: string | null;
  fonte_dados: string | null;
  valor_liquido: string | null;
  valor_taxas: string | null;
  documento_pagador: string | null;
  nome_pagador: string | null;
  email_pagador: string | null;
  chave_conciliacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionDetalhesMP {
  id: number;
  card: any[];
  tags: any;
  order: {
    id: string;
    type: string;
  };
  payer: {
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
  };
  pos_id: string | null;
  status: string;
  barcode: {
    content: string;
  };
  refunds: any[];
  brand_id: string | null;
  captured: boolean;
  metadata: any[];
  store_id: string | null;
  issuer_id: string;
  live_mode: boolean;
  sponsor_id: string | null;
  binary_mode: boolean;
  currency_id: string;
  description: string;
  fee_details: any[];
  platform_id: string | null;
  collector_id: number;
  date_created: string;
  installments: number;
  taxes_amount: number;
  accounts_info: any;
  build_version: string;
  coupon_amount: number;
  date_approved: string | null;
  integrator_id: string | null;
  shipping_cost: number;
  status_detail: string;
  corporation_id: string | null;
  operation_type: string;
  payment_method: {
    id: string;
    data: any[];
    type: string;
    issuer_id: string;
    forward_data: {
      ticket_number: string;
      agreement_number: string;
    };
  };
  additional_info: {
    items: Array<{
      id: string | null;
      title: string;
      quantity: string;
      unit_price: string;
      category_id: string | null;
      description: string;
      picture_url: string;
    }>;
    poi_id: string | null;
    ip_address: string;
    tracking_id: string;
    nsu_processadora: string | null;
    available_balance: number | null;
    authentication_code: string | null;
  };
  charges_details: Array<{
    id: string;
    name: string;
    type: string;
    amounts: {
      original: number;
      refunded: number;
    };
    accounts: {
      to: string;
      from: string;
    };
    metadata: any[];
    client_id: number;
    reserve_id: string | null;
    date_created: string;
    last_updated: string;
    refund_charges: any[];
  }>;
  financing_group: string | null;
  merchant_number: string | null;
  payment_type_id: string;
  processing_mode: string;
  shipping_amount: number;
  counter_currency: string | null;
  deduction_schema: string | null;
  notification_url: string | null;
  date_last_updated: string;
  marketplace_owner: string | null;
  payment_method_id: string;
  authorization_code: string | null;
  date_of_expiration: string;
  external_reference: string | null;
  money_release_date: string | null;
  transaction_amount: number;
  merchant_account_id: string | null;
  transaction_details: {
    barcode: {
      content: string;
    };
    digitable_line: string;
    overpaid_amount: number;
    total_paid_amount: number;
    verification_code: string;
    acquirer_reference: string;
    installment_amount: number;
    net_received_amount: number;
    external_resource_url: string;
    financial_institution: string;
    payable_deferral_period: string | null;
    payment_method_reference_id: string;
  };
  money_release_schema: string | null;
  money_release_status: string;
  point_of_interaction: {
    type: string;
    business_info: {
      unit: string;
      branch: string;
      sub_unit: string;
    };
    transaction_data: {
      e2e_id: string | null;
    };
  };
  statement_descriptor: string | null;
  call_for_authorize_id: string | null;
  acquirer_reconciliation: any[];
  differential_pricing_id: string | null;
  transaction_amount_refunded: number;
}
