'use client'

import { useRouter } from 'next/navigation';
import { HttpMethod, useFetch } from '@/utils/useFetch';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';

type PageProps = {
  params: {
    code: string;
  };
}

type ResponseProps = {
  caminho: number;
}

export default function U({ params }: PageProps) {
  const router = useRouter();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) throw new Error('Access token is missing');

  const { data, loading: _, error, fetchData } = useFetch<ResponseProps>();

  useEffect(() => {
    fetchData(`${process.env.NEXT_PUBLIC_API}/api/url/resolve/${params.code}`, {
      method: HttpMethod.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    if (!data?.caminho) return console.error('Erro ao resolver URL:', error);
    if (typeof data.caminho !== 'number' || data.caminho <= 0) return console.error('Caminho inválido:', data.caminho);

    const fullShortUrl = `${window.location.origin}/apps/orcamento/backoffice/uniforme?id=${data.caminho}`;
    router.push(fullShortUrl);
  }, [data]);

  return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flex: 1,
  }}>
    <CircularProgress />
  </div>;
}