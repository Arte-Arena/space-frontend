'use client';
import { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ContaForm from '../components/formConta';
import ParentCard from '@/app/components/shared/ParentCard';
import { ContasForm } from '../components/types';
import NotificationSnackbar from '@/utils/snackbar';

const ContasPagarReceberAdicionarScreen = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values: ContasForm) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: values.titulo,
          descricao: values.descricao,
          valor: values.valor,
          data_vencimento: values.data_vencimento,
          status: values.status,
          tipo: values.tipo,
          recorrencia: values.recorrencia,
          fixa: values.fixa,
          parcelas: values.parcelas,
          data_pagamento: values.data_pagamento,
          data_emissao: values.data_emissao,
          forma_pagamento: values.forma_pagamento,
          orcamento_staus_id: values.orcamento_staus_id,
          estoque_id: values.estoque_id,
          estoque_quantidade: values.estoque_quantidade,
          documento: values.documento,
          observacoes: values.observacoes,
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
        <ContaForm onSubmit={handleSubmit} />
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

export default ContasPagarReceberAdicionarScreen;