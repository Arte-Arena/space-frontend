'use client'
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import ApexOrcamentoStatus from "@/app/components/charts/quantidadeOrcamentoStatus";
import ParentCard from "@/app/components/shared/ParentCard";

interface OrcamentoStatus {
  aprovados: number;
  naoAprovados: number;
}

const BCrumb = [
  { to: "/", title: "Home" },
  { to: '/apps/vendas/', title: "Vendas" },
  { to: '/apps/vendas/relatorios/', title: "Relatórios de Vendas" },
  { to: '/apps/vendas/relatorios/orcamentos', title: "Orçamentos" },
];

const VendasRelatoriosOrcamentosPorStatus = () => {
  const [dados, setDados] = useState<OrcamentoStatus | null>(null);
  const [aprovados, setAprovados] = useState<number>(0);
  const [naoAprovados, setNaoAprovados] = useState<number>(0);

  // Pega token do localStorage
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    console.error('Access token is missing');
  }

  // Fetch da API usando react-query
  const { data, isFetching, error } = useQuery({
    queryKey: ['quantidadeOrcamentosData'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acesso não disponível');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-por-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar dados");
      }

      return res.json();
    },
    enabled: !!accessToken, // Só executa a query se houver token
  });


  useEffect(() => {
    if (data) {
      // Verificar se os dados são válidos
      setDados(data);
      setAprovados(data.aprovados || 0); // Garantir que aprovados seja um número
      setNaoAprovados(data.naoAprovados || 0); // Garantir que naoAprovados seja um número
    }
  }, [data]);
  
  
  return (
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* breadcrumb */}
      <Breadcrumb title="Relatório de Vendas - Orçamentos" items={BCrumb} />


      {/* Passando dados para o gráfico */}
      <div style={{ marginBottom: '50px' }}>
        <ParentCard title="Orçamentos Aprovados X não Aprovados">
          {dados ? (
            <ApexOrcamentoStatus aprovados={aprovados} naoAprovados={naoAprovados}/> 
          ) : (
            <div>Sem dados disponíveis para exibir.</div>
          )}
        </ParentCard>
      </div>
    </PageContainer>
  );
};

export default VendasRelatoriosOrcamentosPorStatus;