'use client'
import { useEffect, useState } from "react";
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import {ArteFinal} from '../types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation'; // Importe useParams
import ArteFinalForm from "../components/ArteFinalForm";

export default function ProdutosPacotesUniformesDetailsScreen() {
  const params = useParams();
  const pacoteId = params.id;

  const [pacoteUniforme, setPacoteUniforme] = useState<ArteFinal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  const { data: pacotesUniformeData, isLoading: isLoadingPacotesUniforme } = useQuery<ArteFinal[]>({
    queryKey: ['pacotes-uniforme'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto/pacote/uniforme/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (!isLoadingPacotesUniforme && pacotesUniformeData) {
      const pacote = pacotesUniformeData.find((p) => p.id === Number(pacoteId));
      if (pacote) {
        setPacoteUniforme(pacote);
        setError(null);
      } else {
        setError(`Produto não encontrado com id ${pacoteId}`);
      }
    }
  }, [isLoadingPacotesUniforme, pacotesUniformeData, pacoteId]);

  if (isLoadingPacotesUniforme) return <p>Carregando...</p>;

  if (error) return <p>{error}</p>;

  if (!pacoteUniforme) return <p>Carregando...</p>;

  async function handleUpdate(data: ArteFinal) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedido-arte-final`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      console.log("Pacote atualizado:", data);
    } else {
      console.error("Erro ao atualizar pacote:", await response.text());
    }
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
          <h2 className="text-xl font-bold">Detalhes do Produto</h2>
          <ArteFinalForm initialData={pacoteUniforme} onSubmit={handleUpdate} />
        </>
      </ParentCard>
    </PageContainer>
  );
}
