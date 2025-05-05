'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import EstoqueForm from '../components/estoqueForm'; // Import the form component
import { useRouter } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import { Fornecedor } from '../components/Types';

const AdicionarProdutoEstoqueScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);  
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push('/login');
    return null;
  }

  const handleSubmit = (values: any) => {
    setIsLoading(true);
    
    const payload = {
      ...values,
      fornecedores: (values.fornecedores as Array<string | Fornecedor>).map(f =>
        // Se veio string (freeSolo), usamos só o texto;
        // Senão, pegamos apenas nome_completo do objeto Fornecedor
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
        console.log("Dados enviados [Produtos]:", values);
        console.log("Dados recebidos :", data);
      })
      .catch((error) => console.error("Erro ao buscar Produtos:", error))
      .finally(() => {setIsLoading(false); router.push('../estoque');});
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
    </PageContainer>
  );
};

export default AdicionarProdutoEstoqueScreen;

