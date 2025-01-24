'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import Typography from "@mui/material/Typography";
// import ApexLine from "@/app/components/charts/ApexLine";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    to: '/apps/vendas/',
    title: "Vendas",
  },
  {
    to: '/apps/vendas/relatorios/',
    title: "Relatórios de Vendas",
  },
  {
    to: '/apps/vendas/relatorios/orcamentos',
    title: "Orçamentos",
  },
];




const VendasRelatoriosOrcamentos = () => {
  const [total, setTotal] = useState(0);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['orcamentosData'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()).then(data => setTotal(data.totalOrcamentos)),
  });

  return (
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* breadcrumb */}
      <Breadcrumb title="Relatorio de Vendas - Orçamentos" items={BCrumb} />
      {/* end breadcrumb */}

      <div>
        <Typography variant="h6" component="p" gutterBottom>
          Total de Orçamentos:
            <strong style={{ backgroundColor: '#0b73e5', color:'white', borderRadius: '5px', padding: '0.25rem 0.5rem', margin: '0.5rem' }}>{total}</strong>
        </Typography>
      </div>
      {/* <ApexLine /> */}
    </PageContainer>
  );
};

export default VendasRelatoriosOrcamentos;
