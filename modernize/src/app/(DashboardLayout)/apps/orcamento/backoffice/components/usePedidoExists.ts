import { useState, useEffect, useMemo } from "react";

interface PedidoArteFinal {
  id?: number;
  user_id?: number | null;
  vendedor_id?: number | null;
  numero_pedido: Number;
  data_prevista: Date;
  prazo_arte_final: Date;
  prazo_confeccao: Date;
  // lista_produtos: Produto[];
  observacao: string;
  rolo: string;
  estagio?: string | null;
  designer_id?: number | null;
  pedido_status_id?: number | null;
  pedido_tipo_id?: number | null;
  observacoes?: string | null;
  status: string;
  url_trello?: string | null;
  prioridade?: string | null;
  orcamento_id?: number | null;
  tipo_de_pedido: string;
  created_at: Date;
  updated_at: Date;
  codigo_rastreamento: string | null;
}


const useFetchPedidoArteFinal = (id: number | string) => {
  const [pedido, setPedido] = useState<PedidoArteFinal | null>(null);
  const [response, setResponse] = useState<boolean>(false);
  const [isLoadingPedido, setIsLoading] = useState(true);
  const [errorPedido, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPedidoArteFinal = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-arte-final-by-orcamento/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) setResponse(false);

        setResponse(true);

        const json = await res.json();
        console.log(json);
        setPedido(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidoArteFinal();
  }, [id]);

  // Retorna um objeto memorizado para otimizar performance
  return useMemo(() => ({ response, isLoadingPedido, errorPedido }), [response, isLoadingPedido, errorPedido]);
};

export default useFetchPedidoArteFinal;