'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import SectionCard from '../components/sectionCard';
import { Produto } from '../components/types';
import DadosComplementares from '../components/dadosComplementares';
import DadosGerais from '../components/dadosGerais';


function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index } = props;
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function ProdutoDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);

  if (!accessToken) {
    router.push('/auth/login');
    return null;
  }

  useEffect(() => {
    if (!id) return setLoading(false);
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/produto/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setProduto(res.data))
      .catch(() => setError('Erro ao carregar produto.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <Typography color="error" align="center">{error}</Typography>;
  if (loading || !produto)
    return (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  const tabLabels = ['Dados gerais', 'Dados complementares', 'Valores', 'Ficha técnica', 'Estoque', 'Anúncios', 'Outros'];

  // primeira e a segunda seções já customizadas
  const sections: Array<{
    title: string;
    component?: React.ReactNode;
    fields?: Array<keyof Produto>;
  }> = [
      { title: 'Dados gerais', component: <DadosGerais produto={produto} /> },
      { title: 'Dados complementares', component: <DadosComplementares produto={produto} /> },
      { title: 'Valores', fields: ['preco', 'preco_promocional', 'preco_custo', 'preco_custo_medio', 'valor_ipi_fixo'] },
      { title: 'Ficha técnica', fields: ['ncm', 'origem', 'classe_ipi', 'cod_lista_servicos', 'cest'] },
      { title: 'Estoque', fields: ['tipoEmbalagem', 'alturaEmbalagem', 'comprimentoEmbalagem', 'larguraEmbalagem',
        'diametroEmbalagem', 'gtin_embalagem', 'estoque_minimo', 'estoque_maximo', 'peso_liquido', 'peso_bruto', 'gtin']
      },
      { title: 'Anúncios', fields: ['slug', 'seo_title', 'seo_keywords', 'seo_description'] },
      { title: 'Outros', fields: ['variacoes', 'tipo_variacao', 'sob_encomenda', 'dias_preparacao', 'obs'] }
    ];

  return (
    <Box sx={{ p: 3, maxWidth: '80%', mx: 'auto' }}>
      <Breadcrumb title="Produtos / Buscar" subtitle="Gerencie Produtos / Buscar" />

      <Typography variant="h4" mb={2}>Detalhes do Produto</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
          {tabLabels.map(label => <Tab key={label} label={label} />)}
        </Tabs>
      </Box>

      {sections.map((sec, idx) => (
        <TabPanel key={idx} value={tabIndex} index={idx}>
          {sec.component
            ? sec.component
            : <SectionCard title={sec.title} produto={produto} fields={sec.fields!} />
          }
        </TabPanel>
      ))}
    </Box>
  );
}