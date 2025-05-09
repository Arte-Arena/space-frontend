'use client';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ContaForm from '../../components/formConta';
import ParentCard from '@/app/components/shared/ParentCard';
import { ContasForm } from '../../components/types';
import NotificationSnackbar from '@/utils/snackbar';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, LinearProgress } from '@mui/material';

const ContasPagarReceberEditarScreen = () => {
  const [conta, setConta] = useState<ContasForm | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const params = useParams();
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const id = params.id;

  if (!accessToken) {
    router.push('/login');
    return null;
  }

 useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/conta/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos :", data);
        setConta(data);
        setSnackbar({
          open: true,
          message: ' com sucesso!',
          severity: 'success',
        });
      })
      .catch((error) => {
        // console.error("Erro ao buscar Produtos:", error);
        setSnackbar({
          open: true,
          message: error.message || 'Falha ao adicionar produto.',
          severity: 'error',
        });
      });
  }, [id])


  if (!conta) {
    return (
      <ParentCard title='Editar Conta'>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
          <LinearProgress
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 9999,
            }}
          />
        </Box>
      </ParentCard>
    );
  }


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values: ContasForm) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          conta_id: id,
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
        router.push('/apps/contas-pagar-receber/buscar');
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
    <PageContainer title="Editar Conta" description="Editar conta">
      <Breadcrumb title="Editar Conta" subtitle="Gerenciar contas" />
      <ParentCard title="Formulário de Conta">
        <ContaForm onSubmit={handleSubmit} initialValues={conta}/>
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

export default ContasPagarReceberEditarScreen;