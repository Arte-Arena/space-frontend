'use client';
import { useEffect, useState } from "react";
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ArteFinalForm from "@/app/(DashboardLayout)/apps/producao/arte-final/ArteFinalForm";
import { ArteFinal } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function EditArteFinalScreen() {
  const params = useParams();
  const pedidoId = params.id;
  const url = new URL(window.location.href);
  const block_tiny = url.searchParams.get('block_tiny') === 'true';

  const [pedidoArteFinal, setPedidoArteFinal] = useState<ArteFinal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  const { data: pedidoData, isLoading: isLoadingPedido } = useQuery<ArteFinal>({
    queryKey: ['pedido'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final/${pedidoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (!isLoadingPedido && pedidoData) {
      if (pedidoData) {
        const processedData = {
          ...pedidoData,
          lista_produtos: typeof pedidoData.lista_produtos === 'string' 
            ? JSON.parse(pedidoData.lista_produtos)
            : pedidoData.lista_produtos
        };
        setPedidoArteFinal(processedData);
        setError(null);
      } else {
        setError(`Produto não encontrado com id ${pedidoId}`);
      }
    }
  }, [isLoadingPedido, pedidoData, pedidoId]);

  if (isLoadingPedido) return <p>Carregando...</p>;

  if (error) return <p>{error}</p>;

  if (!pedidoArteFinal) return <p>Carregando...</p>;


  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Arte Final",
    },
    {
      to: "/apps/producao/arte-final",
      title: "Arte - Final",
    },
  ];

  console.log('pedidoArteFinal', pedidoArteFinal);

  return (
    <PageContainer title="Produção / Arte Final" description="Arte Final da Arte Arena">
      <Breadcrumb title="Produção / Arte Final" items={BCrumb} />
      <ParentCard title="Arte Final">
        <>
          <h2 className="text-xl font-bold">Detalhes do Produto</h2>
          <ArteFinalForm initialData={pedidoArteFinal} block_tiny={block_tiny} />
        </>
      </ParentCard>
    </PageContainer>
  );
}