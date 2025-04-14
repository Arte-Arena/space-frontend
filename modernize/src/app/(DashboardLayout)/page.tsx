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
        <p>
          Sistema interno de gestão de vendas e produção.
        </p>
      </ParentCard>
    </PageContainer>
  )
}
