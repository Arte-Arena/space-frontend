'use client';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ArteFinalForm from "@/app/(DashboardLayout)/apps/producao/arte-final/ArteFinalForm";

export default function ProdutosPacotesUniformesAddScreen() {

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
          <h2 className="text-xl font-bold">Adicionar Novo Pedido com Arte Final (apenas Space)</h2>
          <ArteFinalForm block_tiny={true} block_brush={true}/>
        </>
      </ParentCard>
    </PageContainer>
  );

}