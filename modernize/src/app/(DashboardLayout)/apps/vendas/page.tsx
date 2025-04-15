'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/useAuth';

export default function Vendas() {
  const router = useRouter();

  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    router.push('/apps/vendas/relatorios/');
  }, [router]);

  return null;
}
