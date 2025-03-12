const trocarStatusPedido = async (id: number, status_id: number): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Usuário não autenticado.");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-status-change/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ pedido_status_id: status_id }),
      }
    );

    if (!res.ok) throw new Error("Erro ao alterar o status do pedido.");

    return true; // ✅ Sucesso
  } catch (error) {
    console.error("Erro ao trocar status do pedido:", error);
    return false; // ❌ Falha
  }
};

export default trocarStatusPedido;
