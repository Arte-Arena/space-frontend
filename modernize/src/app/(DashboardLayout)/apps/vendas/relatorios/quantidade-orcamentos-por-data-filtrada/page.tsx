'use client'
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import ApexOrcamentos from "@/app/components/charts/quantidadeOrcamentoChart";
import ParentCard from "@/app/components/shared/ParentCard";
import { Typography, Box, TextField, Button, Grid, Select, MenuItem } from "@mui/material";
import useUsers from '@/app/components/charts/SelectUsers';

interface Orcamento {
  date: string;
  count: number;
}

const BCrumb = [
  { to: "/", title: "Home" },
  { to: '/apps/vendas/', title: "Vendas" },
  { to: '/apps/vendas/relatorios/', title: "Relatórios de Vendas" },
  { to: '/apps/vendas/relatorios/orcamentos', title: "Orçamentos" },
];

const VendasRelatoriosOrcamentosPorDataFiltrada = () => {
  const [dados, setDados] = useState<Orcamento[]>([]);
  const [vendedorId, setVendedorId] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  // data fim = hoje por default
  const hoje = format(new Date(), 'yyyy-MM-dd');
  const [dataFim, setDataFim] = useState<string>(hoje);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const { data: users, error: usersError, isLoading: usersLoading } = useUsers(); 

  // Pega token do localStorage
  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

  if (!accessToken) {
    console.error('Access token is missing');
  }

  // ========================================================================================= \\
  // Fetch inicial (sem filtro)
  const { data, error } = useQuery({
    queryKey: ['quantidadeOrcamentosData'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acesso não disponível');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-por-dia`, {
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

  // Atualiza os dados iniciais
  useEffect(() => {
    if (data && Array.isArray(data.totalOrcamentos)) {
      setDados(data.totalOrcamentos);
    }
  }, [data]);

  // ========================================================================================= \\
  // Função para buscar dados filtrados
  const buscarDadosFiltrados = async () => {
    if (!accessToken) {
      console.error('Token de acesso não disponível');
      return;
    }

    setIsFetchingData(true);
      
      const queryParams = new URLSearchParams({
        ...(vendedorId && { vendedor_id: vendedorId }),
        ...(dataInicio && { data_inicio: dataInicio }),
        ...(dataFim && { data_fim: dataFim }),
      }).toString();


    const apiUrl = `${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-por-dia-filtered?${queryParams}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar dados filtrados");
      }

      const resultado = await res.json();
      setDados(resultado.totalOrcamentos);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingData(false);
    }
  };

  return (
    <PageContainer title="Relatório de Vendas - Orçamentos" description="Histórico de Orçamentos do Vendedor">
      {/* Breadcrumb */}
      <Breadcrumb title="Relatório de Vendas - Orçamentos" items={BCrumb} />
      
      <div style={{ marginBottom: '1rem' }}>
        <Typography style={{marginBottom: '1rem'}} variant="h6" component="p" gutterBottom>Filtrar Resultados:</Typography>
        
        <Box display="flex" gap={2} flexWrap="wrap" >  
          <TextField
            type="text"
            label="Vendedor ID"
            value={vendedorId}
            size="small"
            onChange={(e) => setVendedorId(e.target.value)}
          />

          <Select
            value={vendedorId}
            onChange={(e) => setVendedorId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Selecione um vendedor</MenuItem>
            {users?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
                {/* {user.id} */}
              </MenuItem>
            ))}
          </Select>


          {/*Filtro de Data Personalizado */}
          <TextField
            type="date"
            label="Data Início"
            value={dataInicio}
            size="small"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDataInicio(e.target.value)}
            />
          <TextField
            type="date"
            label="Data Fim"
            value={dataFim}
            size="small"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDataFim(e.target.value)}
          />
          
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={buscarDadosFiltrados}
              disabled={isFetchingData}
              >
            {isFetchingData ? 'Carregando...' : 'Buscar'}
            </Button>
          </Grid>

        </Box>

      </div>

      {/* Gráfico */}
      <div style={{ marginBottom: '50px' }}>
        <ParentCard title="Orçamentos Dia a Dia">
          {dados.length > 0 ? (
            <ApexOrcamentos totalOrcamentos={dados} />
          ) : (
            <div>Sem dados disponíveis para exibir.</div>
          )}
        </ParentCard>
      </div>
    </PageContainer>
  );
};

export default VendasRelatoriosOrcamentosPorDataFiltrada;
