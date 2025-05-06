// hooks/useMovimentacoes.ts
import { useQuery } from '@tanstack/react-query'

export function useMovimentacoes(accessToken: string | null) {
  return useQuery({
    queryKey: ['movimentacoes'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/movimentacoes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar movimentações');

      const json = await response.json();
      return json.data;
    },
    enabled: !!accessToken, // só executa se tiver token
    staleTime: 1000 * 60 * 5, // cache de 5 minutos
    retry: 2, // tenta mais 2 vezes em caso de falha
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}
