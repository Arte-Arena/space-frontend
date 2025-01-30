'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    code: string;
  };
}

export default function S({ params }: PageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { code } = params;

  useEffect(() => {

    const resolveLink = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/encurtador-link/resolve/${code}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.original_url) {
            router.push(data.original_url);
          } else {
            setError('URL original não encontrada.');
          }
        } else {
          setError(`Erro ao resolver URL: ${data.error}`);
        }
      } catch (err) {
        setError('Erro ao realizar a requisição.');
      } finally {
        setLoading(false);
      }
    };

    resolveLink();
  }, [code, router]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Redirecionando de Arte Arena...</h1>
    </div>
  );
}
