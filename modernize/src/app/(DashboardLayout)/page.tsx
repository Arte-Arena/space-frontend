'use client'

import Box from '@mui/material/Box'
import { useEffect, useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import { useAuth } from '@/utils/useAuth';
import VendasRelatoriosOrcamentosPorStatusComponent from '../components/dashboard-index/ConversaoOrcamento';
import VendasRelatoriosOrcamentosPorDataComponent from '../components/dashboard-index/OrcamentoPorDataMes';
import { Grid } from '@mui/material';
import ParentCard from "@/app/components/shared/ParentCard";
import ValorTotalPedidosComponent from '../components/dashboard-index/ValorTotalPedidos';

export default function Dashboard() {

  const isLoggedIn = useAuth();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLoading(false);
  }, [isLoggedIn]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // aqui deve conter alguns dos charts do space
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <ParentCard title="Relatórios">
        {/* Primeira linha: Um gráfico maior */}
        <Grid container spacing={2}>

          {/* 1° em linha */}
          <Grid item xs={12} md={7}>
            <Box sx={{ border: '1px solid #394457', padding: 2, height: '85%' }}>
              <VendasRelatoriosOrcamentosPorDataComponent />
            </Box>
          </Grid>

          {/* 2° em pizza */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '85%', border: '1px solid #394457', padding: 2 }}>
              <VendasRelatoriosOrcamentosPorStatusComponent />
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              </Box>
            </Box>
          </Grid>

          {/* Segunda linha: Três gráficos menores */}
          <Grid item xs={12} md={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <ValorTotalPedidosComponent />
            </Box>
            {/* <VendasRelatoriosOrcamentosPorStatusComponent /> */}
          </Grid>

          {/* <Grid item xs={12} md={4}>
              <VendasRelatoriosOutroComponente />
            </Grid>
            <Grid item xs={12} md={4}>
              <VendasRelatoriosMaisUmComponente />
            </Grid> */}


        </Grid>
      </ParentCard>
    </PageContainer>
  )
}
