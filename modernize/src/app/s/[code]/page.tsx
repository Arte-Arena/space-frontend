'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    code: string;
  };
}

export default function S({ params }: PageProps) {

  const { code } = params; // Acessa o valor dinâmico `code`
  const router = useRouter();

  console.log('Code:', code); // Exibe o código no console

  const resolveLink = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/url/resolve/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.caminho);
      if (typeof data.caminho === 'number' && data.caminho > 0) {
        console.log('O caminho ', data.caminho, ' existe');
        const fullShortUrl = `${window.location.origin}/apps/orcamento/backoffice/cliente-cadastro?id=${data.caminho}`;
        console.log('Full Short URL:', fullShortUrl);
        router.push(fullShortUrl);
      }
    } else {
      console.error('Erro ao resolver URL:', data.error);
    }
  }

  resolveLink();

  return (
    <div>
      <h1>Localizando cliente Arte Arena...</h1>
    </div>
  );
}
