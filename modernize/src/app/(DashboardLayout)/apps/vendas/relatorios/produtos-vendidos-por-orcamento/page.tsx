'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import Typography from "@mui/material/Typography";
import theme from '@/utils/theme';

// import ApexLine from "@/app/components/charts/ApexLine";
interface ApiResponse {
  data: Orcamento[];
}

interface Orcamento {
  nome: string;
  quantidade: number;
}


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
    title: "Relatórios",
  },
  {
    to: '/apps/vendas/relatorios/valores-vendidos-por-orcamento/',
    title: "Valores Vendidos por Orçamento",
  },
];


const VendasRelatoriosValoresVendidosPorOrcamento = () => {
  const [produtosVendidos, setProdutosVendidos] = useState<Orcamento[]>([]);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error } = useQuery({
    queryKey: ['produtosVendidos'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/produtos-vendidos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()).then(data => setProdutosVendidos(data.produtosVendidos)),
  });

  return (
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* breadcrumb */}
      <Breadcrumb title="Relatorio de Vendas - Orçamentos" items={BCrumb} />
      {/* end breadcrumb */}

      <div>
        <Typography variant="h6" component="p" gutterBottom style={{ marginBottom: '2rem' }}>
          Total de Orçamentos:
        </Typography>

        {produtosVendidos.map((produto, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <strong style={{ backgroundColor: theme.palette.secondary.main, color: 'white', borderRadius: '5px', padding: '0.25rem 0.5rem' }}>
              {produto.nome}: 
            </strong>
            <strong style={{ backgroundColor: theme.palette.primary.main, color: 'white', borderRadius: '5px', padding: '0.25rem 0.5rem' }}>
              {produto.quantidade}
            </strong>
          </div>
        ))}
      </div>


      {/* <ApexLine /> */}
    </PageContainer>
  );
};

export default VendasRelatoriosValoresVendidosPorOrcamento;
