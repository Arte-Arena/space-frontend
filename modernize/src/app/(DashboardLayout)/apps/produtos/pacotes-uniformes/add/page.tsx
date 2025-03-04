'use client'
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ProdutoPacoteUniformeForm from "@/app/(DashboardLayout)/apps/produtos/pacotes-uniformes/ProdutoPacoteUniformeForm";
import ProdutoPacoteUniforme from '../types';

export default function ProdutosPacotesUniformesAddScreen() {

  function handleAdd(data: ProdutoPacoteUniforme) {
    console.log("Pacote criado:", data);
    // Aqui, você pode enviar a atualização para a API
  }

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/produtos/",
      title: "Produtos",
    },
    {
      to: "/apps/produtos/pacotes-uniformes",
      title: "Pacotes de Uniformes",
    },
  ];

  return (
    <PageContainer title="Produtos / Pacotes de Uniformes" description="Pacotes de Uniformes da Arte Arena">
      <Breadcrumb title="Produtos / Pacotes de Uniformes" items={BCrumb} />
      <ParentCard title="Pacotes de Uniformes">
        <>
          <h2 className="text-xl font-bold">Adicionar Novo Pacote de Uniformes</h2>
          <ProdutoPacoteUniformeForm onSubmit={handleAdd} />
        </>
      </ParentCard>
    </PageContainer>
  );

}