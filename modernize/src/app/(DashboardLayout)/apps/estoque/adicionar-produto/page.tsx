'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import EstoqueForm from '../components/estoqueForm'; // Import the form component
import { useRouter } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import { Fornecedor } from '../components/Types';
import NotificationSnackbar from '@/utils/snackbar';

const AdicionarProdutoEstoqueScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: '', severity: 'success' });

  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = (values: any) => {
    setIsLoading(true);

    const payload = {
      ...values,
      fornecedores: (values.fornecedores as Array<string | Fornecedor>).map(f =>
        typeof f === 'string'
          ? { nome_completo: f }
          : { fornecedor_id: f.id, nome_completo: f.nome_completo, tipo_pessoa: f.tipo_pessoa, email: f.email, celular: f.celular }
      ),
    };

    fetch(`${process.env.NEXT_PUBLIC_API}/api/estoque`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbar({
          open: true,
          message: 'Produto adicionado ao estoque com sucesso!',
          severity: 'success',
        });
        console.log("Dados enviados [Produtos]:", values);
        console.log("Dados recebidos :", data);
      })
      .catch((error) => {
        console.error("Erro ao buscar Produtos:", error); setSnackbar({
          open: true,
          message: error.message || 'Falha ao adicionar produto.',
          severity: 'error',
        });
      })
      .finally(() => { setIsLoading(false); router.push('../estoque'); });
  };

  return (
    <PageContainer title="Adicionar Produto ao Estoque" description="Adicionar um novo produto ao estoque">
      <Breadcrumb title="Adicionar Produto ao Estoque" />
      <ParentCard title="Adicionar Produto ao Estoque">
        <>
          <EstoqueForm onSubmit={handleSubmit} />
          {isLoading && (

            <LinearProgress
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 9999,
              }}
            />
          )}
        </>
      </ParentCard>
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={900}
      />
    </PageContainer>
  );
};

export default AdicionarProdutoEstoqueScreen;

