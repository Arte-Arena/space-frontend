'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    code: string;
  };
}

export default function S({ params }: PageProps) {

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { code } = params; // Acessa o valor dinâmico `code`
  const router = useRouter();

  console.log('Code:', code); // Exibe o código no console

  const resolveLink = async (orcamentoId: number) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/resolve/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      // router.push(data.url);
      console.log(data.caminho);
      if (typeof data.caminho === 'number' && data.caminho > 0) {
        console.log('O caminho ', data.caminho, ' existe');
        const fullShortUrl = `${window.location.origin}/apps/orcamento/backoffice/cliente-cadastro?id=${data.caminho}`;
        console.log('Full Short URL:', fullShortUrl);
      }
    } else {
      console.error('Erro ao resolver URL:', data.error);
    }

  }

  resolveLink(Number(code));

  return (
    <div>
      <h1>Localizando cliente Arte Arena...</h1>
    </div>
  );
}
