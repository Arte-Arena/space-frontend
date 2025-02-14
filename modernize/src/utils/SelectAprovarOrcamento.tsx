import { useQuery } from '@tanstack/react-query';

interface Orcamento {
  total_orcamento: number; 
  valor_descontado: number; 
  taxa_antecipa: number; 
  data_antecipa: string; 
  created_at: string;
}

const useAprovarOrcamentos = (id: number) => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

    return useQuery<Orcamento[], Error>({
        queryKey: ['orcamento', id], // Inclua o ID para evitar cache incorreto
        queryFn: async () => {
            if (!accessToken) {
                throw new Error('Token de acesso não disponível');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-valores/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                throw new Error("Erro ao buscar dados");
            }

            return res.json();
        },
        enabled: !!accessToken && !!id, // Só executa a query se houver token e ID válido
    });
};

export default useAprovarOrcamentos;
