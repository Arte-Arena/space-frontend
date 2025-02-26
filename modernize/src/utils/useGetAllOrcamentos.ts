import { useQuery } from "@tanstack/react-query";

interface Orcamento {
    id: number;
    user_id: number;
    cliente_octa_number: string;
    nome_cliente: string | null;
    lista_produtos: string | null;
    texto_orcamento: string | null;
    endereco_cep: string;
    endereco: string;
    opcao_entrega: string;
    prazo_opcao_entrega: number;
    preco_opcao_entrega: number | null;
    status: string;
    created_at: string;
    updated_at: string;
    brinde: number;
    tipo_desconto: string;
    valor_desconto: number;
    data_antecipa: string;
    taxa_antecipa: string;
    total_orcamento: number;
    status_aprovacao_arte_arena: string;
    status_aprovacao_cliente: string;
    status_envio_pedido: string;
    status_aprovacao_amostra_arte_arena: string;
    status_envio_amostra: string;
    status_aprovacao_amostra_cliente: string;
    status_faturamento: string;
    status_pagamento: string;
    status_producao_esboco: string;
    status_producao_arte_final: string;
    status_aprovacao_esboco: string;
    status_aprovacao_arte_final: string;
}

const useFetchOrcamentos = (searchQuery: string, page: number) => {
    return useQuery<Orcamento[]>({
      queryKey: ["budgetData", searchQuery, page],
      queryFn: async () => {
        if (typeof window === "undefined") return Promise.reject(new Error("Execução no servidor não suportada"));
  
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");
  
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/orcamento/get-orcamentos-status?q=${encodeURIComponent(searchQuery)}&page=${page}`,
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
  
        // console.log(json);
  
        return Array.isArray(json.data) ? json.data : json; // Assume que a API retorna um objeto com "data"
      },
    });
  };
  
  export default useFetchOrcamentos;
  