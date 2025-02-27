import { useQuery } from "@tanstack/react-query";

interface Pedidos {
  id: number;
  orcamento_id: number;
  user_id: number | null;
  numero_pedido: string | null;
  data_prevista: string | null;
  pedido_status_id: number | null;
  pedido_tipo_id: number | null;
  pedido_produto_categoria: string | null;
  pedido_material: string | null;
  rolo: string | null;
  medida_linear: string | null;
  prioridade: string | null;
  estagio: string | null;
  situacao: string | null;
  designer_id: number | null;
  observacoes: string | null;
  url_trello: string | null;
  created_at: string;
  updated_at: string;
  codigo_rastreamento: string | null;
}
const useFetchOrcamentos = (searchQuery: string, page: number) => {
    return useQuery<Pedidos[]>({
      queryKey: ["budgetData", searchQuery, page],
      queryFn: async () => {
        if (typeof window === "undefined") return Promise.reject(new Error("Execução no servidor não suportada"));
  
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");
  
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/pedidos/get-pedidos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (!res.ok) throw new Error("Erro ao buscar orçamentos.");
  
        const json = await res.json();
  
        console.log(json);
  
        return Array.isArray(json.data) ? json.data : json; // Assume que a API retorna um objeto com "data"
      },
    });
  };
  
  export default useFetchOrcamentos;
  