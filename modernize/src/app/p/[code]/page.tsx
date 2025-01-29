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

  const { code } = params;
  const router = useRouter();

  console.log('Code:', code);

  const resolveLink = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/encurtador-link/resolve/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.original_url);
      if (data.original_url) {
        router.push(data.original_url);
      }
    } else {
      console.error('Erro ao resolver URL:', data.error);
    }

  }

  resolveLink();

  return (
    <div>
      <h1>Redirecionando de Arte Arena...</h1>
    </div>
  );
}
