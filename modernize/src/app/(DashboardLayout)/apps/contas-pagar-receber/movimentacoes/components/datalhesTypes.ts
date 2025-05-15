export interface DetalhesTransacaoMP {
  id: number;
  card: any[];
  tags: any[] | null;
  order: any[];
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
  pos_id: number | null;
  status: string;
  refunds: any[];
  brand_id: string | null;
  captured: boolean;
  metadata: {
    cpp_extra: {
      site_id: string;
      checkout: string;
      test_mode: boolean;
      platform_id: string;
      checkout_type: string;
      module_version: string;
    };
    plugin_data: {
      website: string;
      tn_total: number;
      tn_currency: string;
      tn_order_id: string;
      tn_store_id: string;
      tn_subtotal: number;
      token_order: string;
      tn_shipping_price: number;
      tn_shipping_method: string;
      tn_payment_attempt_id: string;
      tn_split_store_amount: number;
      tn_split_platform_amount: number;
    };
    platform_metadata: {
      site_id: string;
      checkout: string;
      test_mode: boolean;
      platform_id: string;
      checkout_type: string;
      module_version: string;
    };
    original_notification_url: string;
  };
  store_id: string | null;
  issuer_id: string;
  live_mode: boolean;
  sponsor_id: number;
  binary_mode: boolean;
  currency_id: string;
  description: string;
  fee_details: any[];
  platform_id: string;
  callback_url: string | null;
  collector_id: number;
  date_created: string;
  installments: number;
  release_info: any;
  taxes_amount: number;
  accounts_info: any;
  build_version: string;
  coupon_amount: number;
  date_approved: string | null;
  integrator_id: string | null;
  shipping_cost: number;
  status_detail: string;
  corporation_id: number | null;
  operation_type: string;
  payment_method: {
    id: string;
    type: string;
    issuer_id: string;
  };
  additional_info: {
    items: Array<{
      id?: string;
      title: string;
      quantity: string;
      unit_price: string;
      picture_url?: string;
      category_id?: string;
    }>;
    payer: {
      address: {
        zip_code: string;
        street_name: string;
        street_number: string;
      };
      first_name: string;
    };
    shipments: {
      receiver_address: {
        zip_code: string;
        street_name: string;
        street_number: string;
      };
    };
    tracking_id: string;
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
    metadata: any;
    client_id: number;
    reserve_id: string | null;
    date_created: string;
    last_updated: string;
    refund_charges: any[];
  }>;
  financing_group: any;
  merchant_number: string | null;
  payment_type_id: string;
  processing_mode: string;
  shipping_amount: number;
  counter_currency: string | null;
  deduction_schema: any;
  notification_url: string;
  date_last_updated: string;
  marketplace_owner: any;
  payment_method_id: string;
  authorization_code: string | null;
  date_of_expiration: string;
  external_reference: string;
  money_release_date: string | null;
  transaction_amount: number;
  merchant_account_id: string | null;
  transaction_details: {
    transaction_id: string | null;
    overpaid_amount: number;
    bank_transfer_id: string | null;
    total_paid_amount: number;
    acquirer_reference: string | null;
    installment_amount: number;
    net_received_amount: number;
    external_resource_url: string | null;
    financial_institution: string | null;
    payable_deferral_period: any;
    payment_method_reference_id: string | null;
  };
  money_release_schema: any;
  money_release_status: string;
  point_of_interaction: {
    type: string;
    business_info: {
      unit: string;
      branch: string | null;
      sub_unit: string;
    };
    application_data: {
      name: string | null;
      version: string | null;
      operating_system: string | null;
    };
    transaction_data: {
      e2e_id: string | null;
      qr_code: string;
      bank_info: {
        payer: {
          id: string | null;
          branch: string | null;
          long_name: string | null;
          account_id: string | null;
          identification: any[];
          is_end_consumer: boolean | null;
          external_account_id: string | null;
        };
        collector: {
          long_name: string | null;
          account_id: string | null;
          account_holder_name: string;
          transfer_account_id: string | null;
        };
        origin_bank_id: string | null;
        origin_wallet_id: string | null;
        is_same_bank_account_owner: boolean | null;
      };
      ticket_url: string;
      qr_code_base64: string;
    };
  };
  statement_descriptor: string | null;
  call_for_authorize_id: string | null;
  charges_execution_info: {
    internal_execution: {
      date: string;
      execution_id: string;
    };
  };
  acquirer_reconciliation: any[];
  differential_pricing_id: string | null;
  transaction_amount_refunded: number;
}
