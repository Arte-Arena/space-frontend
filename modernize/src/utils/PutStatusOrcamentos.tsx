
const useStatusChangeAprovado = async (status: string, id: number) => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
    
    if (!accessToken) {
        throw new Error('Token de acesso não disponível');
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamentos/orcamentos-status-change-aprovado/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ campo: status }),
    });

    if (!res.ok) {
        throw new Error("Erro ao atualizar o status");
    }
    return res.json();
};


const useStatusChangeDesaprovado = async (status: string, id: number) => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
    
    if (!accessToken) {
        throw new Error('Token de acesso não disponível');
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamentos/orcamentos-status-change-desaprovado/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ campo: status }),
    });

    if (!res.ok) {
        throw new Error("Erro ao atualizar o status");
    }

    return res.json();
};

export  {useStatusChangeAprovado, useStatusChangeDesaprovado};