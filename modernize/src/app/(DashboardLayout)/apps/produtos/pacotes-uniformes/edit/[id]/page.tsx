'use client'
import { useEffect, useState } from "react";
import ProdutoPacoteUniformeForm from "@/app/(DashboardLayout)/apps/produtos/pacotes-uniformes/ProdutoPacoteUniformeForm";
import ProdutoPacoteUniforme from '../../types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation'; // Importe useParams

export default function ProdutosPacotesUniformesDetailsScreen() {
  const params = useParams();
  const pacoteId = params.id;

  const [pacoteUniforme, setPacoteUniforme] = useState<ProdutoPacoteUniforme | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  const { data: pacotesUniformeData, isLoading: isLoadingPacotesUniforme } = useQuery<ProdutoPacoteUniforme[]>({
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

  function handleUpdate(data: ProdutoPacoteUniforme) {
    console.log("Pacote atualizado:", data);
    // Aqui, você pode enviar a atualização para a API
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Detalhes do Produto</h2>
      <ProdutoPacoteUniformeForm initialData={pacoteUniforme} onSubmit={handleUpdate} />
    </div>
  );
}
