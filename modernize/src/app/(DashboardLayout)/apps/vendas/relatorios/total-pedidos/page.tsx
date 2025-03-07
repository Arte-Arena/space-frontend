'use client'
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ApexPedidosTotal from "@/app/components/charts/TotalPedidos";
import ParentCard from "@/app/components/shared/ParentCard";
import { useTheme } from '@mui/material/styles';

interface Pedidos {
  total_orcamento: number;
  id: number;
  orcamento_id: number;
  created_at: string;
}

const BCrumb = [
  { to: "/", title: "Home" },
  { to: '/apps/vendas/', title: "Vendas" },
  { to: '/apps/vendas/relatorios/', title: "Relatórios de Vendas" },
  { to: '/apps/vendas/relatorios/orcamentos', title: "Orçamentos" },
];

const ValorTotalPedidosScreen = () => {
  const [dados, setDados] = useState<Pedidos[]>([]);
  const [tipoGrafico, setTipoGrafico] = useState("linha"); // Estado para o tipo de gráfico
  const theme = useTheme(); // Pega o tema atual (light ou dark)

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/pedido-total`, {
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
      setDados(data);
    }
  }, [data]);

  const handleTipoGraficoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoGrafico(event.target.value); // Altera o tipo de gráfico
  };

  return (
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* breadcrumb */}
      <Breadcrumb title="Relatório de Vendas - Orçamentos" items={BCrumb} />

      {/* Seleção de tipo de gráfico */}
      <div style={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel id="grafico-select-label">Escolha o tipo de gráfico</InputLabel>
          <Select
            labelId="grafico-select-label"
            id="graficoSelect"
            value={tipoGrafico}
            onChange={handleTipoGraficoChange}
            label="Escolha o tipo de gráfico"
          >
            <MenuItem value="linha">Linha</MenuItem>
            <MenuItem value="barras">Barras</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Passando dados para o gráfico */}
      <div style={{ marginBottom: '50px' }}>
        <ParentCard title="Orçamentos Dia a Dia">
          {dados.length > 0 ? (
            <>
              <ApexPedidosTotal totalOrcamentos={dados} tipoGrafico={tipoGrafico} />
            </>
          ) : (
            <div>Sem dados disponíveis para exibir.</div>
          )}
        </ParentCard>
      </div>
    </PageContainer>
  );
};

export default ValorTotalPedidosScreen;
