const deletePedidoArteFinal = async (id: number | undefined): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Usuário não autenticado.");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/producao/delete-pedido-arte-final/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) throw new Error("Erro ao alterar o status do pedido.");
    return true;
  } catch (error) {
    console.error("Erro ao trocar status do pedido:", error);
    return false; 
  }
};

export default deletePedidoArteFinal;