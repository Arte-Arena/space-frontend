'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";


const BCrumb = [
    { to: "/", title: "Home" },
    { to: '/apps/vendas/', title: "Vendas" },
    { to: '/apps/vendas/relatorios/', title: "Relatórios" },
    { to: '/apps/vendas/relatorios/orcamentos-entrega/', title: "Orçamentos Por Entrega" },
  ];

const VendasRelatoriosOrcamentosEntrega = () => {

    return (
      <PageContainer title="Relatório de Vendas - Orçamentos Não Aprovados" description="Histórico de Orçamentos Não Aprovados">
        <Breadcrumb title="Relatorio de Vendas - Orçamentos Não Aprovados" items={BCrumb} />
        <>
        teste
        </>
      </PageContainer>
  
    )

}

export default VendasRelatoriosOrcamentosEntrega;