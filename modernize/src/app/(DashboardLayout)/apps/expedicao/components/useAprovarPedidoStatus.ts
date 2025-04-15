
const useAprovarPedidoStatus = async (status: string, id: number | string | undefined ) => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
    
    if (!accessToken) {
        // throw new Error('Token de acesso não disponível');
        console.error('Token de acesso não disponível');
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/pedidos/pedido-envio-recebimento-aprovado/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ campo: status }),
    });

    if (!res.ok) {
        // throw new Error("Erro ao atualizar o status");
        console.error("Erro: ", res.text() || "Erro ao atualizar o status");
    }
    return res.json();
};



export default useAprovarPedidoStatus;