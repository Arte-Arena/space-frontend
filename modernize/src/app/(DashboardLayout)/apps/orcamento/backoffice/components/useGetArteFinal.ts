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
  prev_entrega: string;
}


const useFetchOrcamento = (id: number | string) => {
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [isLoadingOrcamento, setIsLoading] = useState(true);
  const [errorOrcamento, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrcamento = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Usuário não autenticado.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/orcamento/get-/${id}`,
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
        setOrcamento(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrcamento();
  }, [id]);

  // Retorna um objeto memorizado para otimizar performance
  return useMemo(() => ({ orcamento , isLoadingOrcamento, errorOrcamento }), [orcamento, isLoadingOrcamento, errorOrcamento]);
};

export default useFetchOrcamento;