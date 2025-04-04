const trocarMedidaLinear = async (id: number | undefined, uid: number | null, medidasLineares: Record<string, number>, refetch: () => void): Promise<boolean> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Usuário não autenticado.");
    const medidaLinear = medidasLineares[String(uid)];

    if (uid === null) {
      console.error("Erro sem UID na request:");
      return false;
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/producao/pedido-medida-change/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uid, medida_linear: medidaLinear }),
      }
    );

    if (!res.ok) throw new Error("Erro ao alterar o prduto do pedido.");
    refetch();
    return true;
  } catch (error) {
    console.error("Erro ao trocar produto do pedido:", error);
    return false;
  }

};

export default trocarMedidaLinear;