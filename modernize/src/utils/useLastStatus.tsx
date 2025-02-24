const useEtapa = () => {
    const fetchEtapas = async () => {
      // Verifica se está rodando no servidor (SSR)
      if (typeof window === "undefined") {
        throw new Error("Execução no servidor não suportada.");
      }
  
      // Obtém o token de acesso do localStorage
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Usuário não autenticado.");
      }
  
      // Faz a requisição usando o axios
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/orcamento/orcamentos-last-status`,
        {
            method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // Retorna os dados da API
      return response;
    };
};

export default useEtapa;