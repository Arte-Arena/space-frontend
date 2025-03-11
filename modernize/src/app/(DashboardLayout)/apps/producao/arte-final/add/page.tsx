'use client';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ArteFinalForm from "@/app/(DashboardLayout)/apps/producao/arte-final/ArteFinalForm";
import { ArteFinal } from '../types';

export default function ProdutosPacotesUniformesAddScreen() {

  async function handleAdd(data: ArteFinal) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedido-arte-final`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Pacote criado:", data);
    } else {
      console.error("Erro ao criar pacote:", await response.json());
    }
  }

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Produção",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Arte Final",
    },
    {
      to: "/apps/producao/arte-final/add",
      title: "Adicionar Pedido - Arte Final",
    },
  ];

  return (
    <PageContainer title="Produção / Arte Final" description="Arte Final da Arte Arena">
      <Breadcrumb title="Produção / Arte Final" items={BCrumb} />
      <ParentCard title="Arte Final">
        <>
          <h2 className="text-xl font-bold">Adicionar Novo Pacote de Uniformes</h2>
          <ArteFinalForm onSubmit={handleAdd} />
        </>
      </ParentCard>
    </PageContainer>
  );

}