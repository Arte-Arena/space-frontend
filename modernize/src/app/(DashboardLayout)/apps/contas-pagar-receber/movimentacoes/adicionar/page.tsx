'use client';
import { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import FormMovimentacoes from '../components/movimentacoesForm';
import ParentCard from '@/app/components/shared/ParentCard';
import { MovimentacaoFinanceira, Parcela } from '../components/types';
import NotificationSnackbar from '@/utils/snackbar';
import { useRouter } from 'next/navigation';

const AdicionarMovimentacaoScreen = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
    return null;
  }
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values: MovimentacaoFinanceira) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orcamento_id: values.orcamento_id,
          orcamento_status_id: values.orcamento_status_id,
          pedido_arte_final_id: values.pedido_arte_final_id,
          carteira_id: values.carteira_id,
          conta_id: values.conta_id,
          estoque_id: values.estoque_id,
          fornecedor_id: values.fornecedor_id,
          cliente_id: values.cliente_id,
          categoria_id: values.categoria_id,
          origin_type: values.origin_type,
          origin_id: values.origin_id,
          numero_pedido: values.numero_pedido,
          documento: values.documento,
          tipo_documento: values.tipo_documento,
          valor_bruto: values.valor_bruto,
          valor_liquido: values.valor_liquido,
          data_operacao: values.data_operacao,
          data_lancamento: values.data_lancamento,
          tipo: values.tipo,
          etapa: values.etapa,
          status: values.status,
          observacoes: values.observacoes,
          lista_produtos: values.lista_produtos,
          metadados_cliente: values.metadados_cliente,
          metadados: {
            forma_pagamento: values.metadados?.forma_pagamento,
            tipo_faturamento: values.metadados?.tipo_faturamento,
            parcelas: values.metadados?.parcelas,
            ...values.metadados // se houver campos adicionais dinâmicos
          },
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        setSnackbar({
          open: true,
          message: data.message || 'Erro ao salvar conta',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Conta salva com sucesso!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Erro na comunicação com o servidor',
        severity: 'error'
      });
    }
  };

  return (
    <PageContainer title="Nova Conta" description="Criar ou editar conta">
      <Breadcrumb title="Nova Conta" subtitle="Gerenciar contas" />
      <ParentCard title="Formulário de Conta">
        <FormMovimentacoes  />
      </ParentCard>

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </PageContainer>
  );
};

export default AdicionarMovimentacaoScreen;