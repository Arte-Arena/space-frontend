import { useQuery } from '@tanstack/react-query';

interface User {
    name: string;
    id: string;
}

const useUsers = () => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

    const { data, error, isLoading } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error('Token de acesso não disponível');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/vendas/orcamentos-user-names`, {
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
        enabled: !!accessToken, // Só executa a query se houver token
    });

    return { data, error, isLoading }; // Retorna os valores
};

export default useUsers;