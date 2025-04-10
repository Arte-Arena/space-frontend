const atribuirDesigner = async (id: number | undefined, refetch: () => void): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const user_id = localStorage.getItem("user_id");  
    if (!accessToken) throw new Error("Usuário não autenticado.");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-designer-change/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({designer_id: user_id }),
      }
    );

    if (!res.ok) throw new Error("Erro ao alterar o designer do pedido.");
    refetch();
    return true;
  } catch (error) {
    console.error("Erro ao trocar designer do pedido:", error);
    return false; 
  }
};

export default atribuirDesigner;