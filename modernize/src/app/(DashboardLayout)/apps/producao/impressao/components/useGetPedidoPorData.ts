import { useState, useEffect, useMemo } from "react";

type PedidoData = {
  quantidade_pedidos: number;
  total_medida_linear: number;
};

type PedidosResponse = {
  dados_por_data: Record<string, PedidoData>; // Um objeto onde a chave é a data
};

const useFetchPedidoPorData = (fila: string | null | undefined) => {
  const [pedido, setPedido] = useState<PedidosResponse | null>(null);
  const [isLoadingPedido, setIsLoading] = useState(true);
  const [errorPedido, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fila) return;

    const fetchPedido = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/producao/get-pedidos-por-data?fila=${fila}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar Pedidos. ");
        console.log(res);

        const json = await res.json();
        console.log(json);
        setPedido(json);

      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
  },[fila]);

  // Retorna um objeto memorizado para otimizar performance
  return useMemo(() => ({ pedido, isLoadingPedido, errorPedido, }), [pedido, isLoadingPedido, errorPedido,]);
};

export default useFetchPedidoPorData;