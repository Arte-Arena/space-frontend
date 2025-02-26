import { useEffect, useState } from "react";

interface Etapa {
  id: string;
  etapa: string;
  orcamento_id: string;
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

const useEtapa = () => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEtapas = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        setError("Token de acesso não encontrado.");
        return;
      }

      const controller = new AbortController(); // Controla o cancelamento da requisição
      const signal = controller.signal;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/orcamento/orcamentos-last-status`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            signal, // Passa o signal para a requisição
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data: Etapa[] = await response.json();
        console.log("data: ", data);
        setEtapas(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort(); // Cancela a requisição se o componente desmontar
    };

    fetchEtapas();
  }, []);

  return { etapas, loading, error };
};

export default useEtapa;
