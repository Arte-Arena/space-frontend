const trocarEstagioPedidoArteFinal = async (id: number | undefined, estagio: string | undefined, refetch: () => void): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Usuário não autenticado.");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-estagio-change/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ estagio: estagio }),
      }
    );

    if (!res.ok) throw new Error("Erro ao alterar o status do pedido.");
    refetch();
    return true;
  } catch (error) {
    console.error("Erro ao trocar status do pedido:", error);
    return false; 
  }
};

export default trocarEstagioPedidoArteFinal;
