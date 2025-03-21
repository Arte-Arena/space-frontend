import getBrazilTime from "@/utils/brazilTime";
import { addDays, isAfter, isEqual, isWeekend } from "date-fns";
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

  const addBusinessDays = (date: Date | number | null, daysToAdd: number | undefined): Date | number | null => {
    if (!date) return null; // Se a data for nula, retorne null imediatamente

    let count = 0;
    let newDate = date;

    if (daysToAdd === undefined) return null;

    while (count < daysToAdd) {
      newDate = addDays(newDate, 1);
      if (!isWeekend(newDate)) {
        count++;
      }
    }

    return newDate;
  };

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


        const prazoDias = orcamento?.prazo_producao;
        const createdAtOrcamento = orcamento?.created_at ? new Date(orcamento.created_at) : null;
        const createdPedido = pedido?.created_at ? new Date(pedido.created_at) : null;
        const DatePrazo = addBusinessDays(createdPedido, prazoDias);
        const DateTransportadora = prazoDias !== undefined ? addBusinessDays(createdPedido, prazoDias + 1) : null;
        const hoje = getBrazilTime();
        console.log(createdAtOrcamento,"X",createdPedido,"X",DatePrazo,"X",DateTransportadora,"X",hoje)


        if (createdAtOrcamento && (isAfter(hoje, createdAtOrcamento) || isEqual(hoje, createdAtOrcamento))) {
          setActiveStep(0);
        }

        if (createdPedido && (isAfter(hoje, createdPedido) || isEqual(hoje, createdPedido))) {
          setActiveStep(1);
        }

        if (DatePrazo && (isAfter(hoje, DatePrazo) || isEqual(hoje, DatePrazo))) {
          setActiveStep(1);
        }

        if (DateTransportadora && (isAfter(hoje, DateTransportadora) || isEqual(hoje, DateTransportadora))) {
          setActiveStep(1);
        }
        // tem que colocar pelo prazo aqui também!

        if (json.pedido.pedido_status_id === 24 || json.pedido.pedido_status_id === 23) {
          setActiveStep(3);
          console.log(json.pedido.pedido_status_id)
        }

        if (json.pedido.pedido_status_id === 25) {
          setActiveStep(4);
          console.log(json.pedido.pedido_status_id)
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