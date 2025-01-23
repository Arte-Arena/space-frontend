'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Vendas() {
  const router = useRouter();

  useEffect(() => {
    router.push('/apps/vendas/relatorios/');
  }, [router]);

  return null;
}
