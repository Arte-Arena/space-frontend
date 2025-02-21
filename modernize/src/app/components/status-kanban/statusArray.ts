const StatusArray = {
    status_aprovacao_arte_arena: {
      aprovado: "aprovado",
      nao_aprovado: "nao_aprovado"
    },
    status_aprovacao_cliente: {
        aprovado: "aprovado",
        nao_aprovado: "aguardando_aprovação",
    },
    status_envio_pedido: {
        aprovado: "enviado",
        nao_aprovado: "nao_enviado"
    },
    status_aprovacao_amostra_arte_arena: {
        aprovado: "aprovada",
        nao_aprovado: "nao_aprovadaa"
    },
    status_envio_amostra: {
        aprovado: "enviada",
        nao_aprovado: "nao_enviada"
    },
    status_aprovacao_amostra_cliente: {
        aprovado: "aprovada",
        nao_aprovado: "nao_aprovada"
    },
    status_faturamento: {
        aprovado: "faturado",
        nao_aprovado: "em_analise"
    },
    status_pagamento: {
        aprovado: "pago",
        nao_aprovado: "aguardando",
    },
    status_producao_esboco: {
        aprovado: "aguardando_melhoria",
        nao_aprovado: "aguardando_primeira_versao",
    },
    status_producao_arte_final: {
        aprovado: "aguardando_melhoria",
        nao_aprovado: "aguardando_primeira_versao",
    },
    status_aprovacao_esboco: {
        aprovado: "aprovado",
      nao_aprovado: "nao_aprovado"
    },
    status_aprovacao_arte_final: {
        aprovado: "aprovada",
      nao_aprovado: "nao_aprovada"
    }
  };
  
  export default StatusArray;
  
       
       
       
       
       
       
    //  Schema::table('orcamentos_status', function (Blueprint $table) {
    //         $table->enum('status_aprovacao_arte_arena', ['aprovado', 'nao_aprovado'])->nullable();
    //         $table->enum('status_aprovacao_cliente', ['aguardando_aprovação', 'aprovado'])->nullable();
    //         $table->enum('status_envio_pedido', ['enviado', 'nao_enviado'])->nullable();
    //         $table->enum('status_aprovacao_amostra_arte_arena', ['aprovada', 'nao_aprovada'])->nullable();
    //         $table->enum('status_envio_amostra', ['enviada', 'nao_enviada'])->nullable();
    //         $table->enum('status_aprovacao_amostra_cliente', ['aprovada', 'nao_aprovada'])->nullable();
    //         $table->enum('status_faturamento', ['em_analise', 'faturado'])->nullable();
    //         $table->enum('status_pagamento', ['aguardando', 'pago'])->nullable();
    //         $table->enum('status_producao_esboco', ['aguardando_primeira_versao', 'aguardando_melhoria'])->nullable();
    //         $table->enum('status_producao_arte_final', ['aguardando_primeira_versao', 'aguardando_melhoria'])->nullable();
    //         $table->enum('status_aprovacao_esboco', ['aprovado', 'nao_aprovado'])->nullable();
    //         $table->enum('status_aprovacao_arte_final', ['aprovada', 'nao_aprovada'])->nullable();
        // });