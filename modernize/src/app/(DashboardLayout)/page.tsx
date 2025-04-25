'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import { useAuth } from '@/utils/useAuth';
import VendasRelatoriosOrcamentosPorStatusComponent from '../components/dashboard-index/ConversaoOrcamento';
import VendasRelatoriosOrcamentosPorDataComponent from '../components/dashboard-index/OrcamentoPorDataMes';
import ValorTotalPedidosComponent from '../components/dashboard-index/ValorTotalPedidos';
import ResumoCard from '../components/dashboard-index/ResumeCards';
import { Grid, Box } from '@mui/material';
import {
  IconUsers,
  IconBuildingStore,
  IconShoppingCart,
  IconBox,
  IconCurrencyBitcoin,
  IconCurrencyDollar
} from '@tabler/icons-react';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [quantidades, setQuantidades] = useState({
    quantidade_pedidos: 0,
    quantidade_clientes: 0,
    quantidade_produtos: 0,
    quantidade_orcamentos: 0,
    valor_total_orcamentos: 0,
    quantidade_funcionarios: 0,
  });

  const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
  const isLoggedIn = useAuth();
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/quantidades`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data); // Substitua com a lógica apropriada para tratar os dados
          setQuantidades(data);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      fetchData();
    }
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
            <Grid item xs={12} sm={6} md={2.4}>
              <ResumoCard titulo="Funcionários" valor={quantidades.quantidade_funcionarios.toLocaleString('pt-BR')} icone={<IconUsers size={24} />} cor="#880e4f" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ResumoCard titulo="Clientes" valor={quantidades.quantidade_clientes.toLocaleString('pt-BR')} icone={<IconBuildingStore size={24} />} cor="#1976d2" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ResumoCard titulo="Produtos" valor={quantidades.quantidade_produtos.toLocaleString('pt-BR')} icone={<IconBox size={24} />} cor="#4a148c" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ResumoCard titulo="Pedidos" valor={quantidades.quantidade_pedidos.toLocaleString('pt-BR')} icone={<IconShoppingCart size={24} />} cor="#ed6c02" />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ResumoCard
                titulo="Total De Pedidos"
                valor={quantidades.valor_total_orcamentos.toLocaleString('pt-BR',
                  { style: 'currency', currency: 'BRL' })}
                icone={<IconCurrencyDollar size={24} />}
                cor="#00695c"
              />
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
