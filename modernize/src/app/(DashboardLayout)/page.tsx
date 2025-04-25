'use client';

import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import { useAuth } from '@/utils/useAuth';
import VendasRelatoriosOrcamentosPorStatusComponent from '../components/dashboard-index/ConversaoOrcamento';
import VendasRelatoriosOrcamentosPorDataComponent from '../components/dashboard-index/OrcamentoPorDataMes';
import ValorTotalPedidosComponent from '../components/dashboard-index/ValorTotalPedidos';
import ResumoCard from '../components/dashboard-index/ResumeCards';

import { Grid } from '@mui/material';
import {
  IconUsers,
  IconBuildingStore,
  IconShoppingCart,
  IconBox
} from '@tabler/icons-react';

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

  return (
    <PageContainer title="Dashboard" description="Painel principal do sistema">
      <Grid container spacing={2}>

        {/* Linha 1: Cards resumo */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoCard titulo="Funcionários" valor={12} icone={<IconUsers size={24} />} cor="#1976d2" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoCard titulo="Clientes" valor={58} icone={<IconBuildingStore size={24} />} cor="#2e7d32" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoCard titulo="Pedidos" valor={102} icone={<IconShoppingCart size={24} />} cor="#ed6c02" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoCard titulo="Produtos" valor={37} icone={<IconBox size={24} />} cor="#6a1b9a" />
            </Grid>
          </Grid>
        </Grid>

        {/* Linha 2: Gráfico maior (em cima) */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid #394457',
              backgroundColor: 'background.paper'
            }}
          >
            <ValorTotalPedidosComponent />
          </Box>

        </Grid>

        {/* Linha 3: Gráficos menores (embaixo) */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #394457',
                  backgroundColor: 'background.paper',
                  height: '100%'
                }}
              >
                <VendasRelatoriosOrcamentosPorStatusComponent />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #394457',
                  backgroundColor: 'background.paper',
                  height: '100%'
                }}
              >
                <VendasRelatoriosOrcamentosPorDataComponent />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>

  );
}
