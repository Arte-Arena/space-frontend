import { useState, useEffect, useMemo } from "react";

interface Pedido {
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

const useFetchPedidoOrcamento = (id: number | string) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoadingPedido, setIsLoading] = useState(true);
  const [errorPedido, setError] = useState<Error | null>(null);
  const [activeStep, setActiveStep] = useState<number | undefined>(1);


  useEffect(() => {
    if (!id) return;

    const fetchOrcamento = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/pedidos/get-pedido-orcamento/${id}`,
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
        setPedido(json);
        if(json.pedido_status_id === 14){
          setActiveStep(3);
        }
        if(json.pedido_status_id === 15){
          setActiveStep(4);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrcamento();
  }, [id]);

  // Retorna um objeto memorizado para otimizar performance
  return useMemo(() => ({ pedido, isLoadingPedido, errorPedido, activeStep }), [pedido, isLoadingPedido, errorPedido, activeStep]);
};

export default useFetchPedidoOrcamento;