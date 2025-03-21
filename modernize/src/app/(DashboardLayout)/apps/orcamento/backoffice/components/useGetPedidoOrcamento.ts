import getBrazilTime from "@/utils/brazilTime";
import { isAfter, isEqual } from "date-fns";
import { useState, useEffect, useMemo } from "react";

interface Orcamento {
  id: number;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
  produtos_brinde: string | null;
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
  prazo_producao: number;
}

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
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [isLoadingPedido, setIsLoading] = useState(true);
  const [errorPedido, setError] = useState<Error | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);


  useEffect(() => {
    if (!id) return;

    const fetchOrcamento = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/pedidos/get-pedido-&-orcamento/${id}`,
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
        console.log(json.orcamento);
        setPedido(json.pedido);
        setOrcamento(json.orcamento);

        const createdAtOrcamento = orcamento?.created_at ? new Date(orcamento.created_at) : null;
        const createdPedido = pedido?.created_at ? new Date(pedido.created_at) : null;
        const hoje = getBrazilTime();

        if (createdAtOrcamento && (isAfter(hoje, createdAtOrcamento) || isEqual(hoje, createdAtOrcamento))) {
          setActiveStep(2);
        }
        
        if (createdPedido && (isAfter(hoje, createdPedido) || isEqual(hoje, createdPedido))) {
          setActiveStep(3);
        }

        if (json.pedido.pedido_status_id === 24 || json.pedido.pedido_status_id === 23) {
          setActiveStep(3);
          if (json.pedido.pedido_status_id === 25) {
        }
          setActiveStep(4);
        }
        
      } catch (err) {
        setError(err as Error);
      } finally {
        console.log(activeStep)
        setIsLoading(false);
      }
    };

    fetchOrcamento();
  }, [id]);

  // Retorna um objeto memorizado para otimizar performance
  return useMemo(() => ({ orcamento, pedido, isLoadingPedido, errorPedido, activeStep }), [orcamento, pedido, isLoadingPedido, errorPedido, activeStep]);
};

export default useFetchPedidoOrcamento;