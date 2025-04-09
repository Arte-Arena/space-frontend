interface ApiResponsePedidosArteFinal {
    data: ArteFinal[];
    total: number;
}


interface ArteFinal {
    id?: number;
    user_id?: number | null;
    vendedor_id?: number | null;
    numero_pedido: Number;
    data_prevista: Date;
    prazo_arte_final: Date;
    prazo_confeccao: Date;
    design: Design;
    lista_produtos: Produto[];
    observacao: string;
    rolo: string;
    estagio?: string | null;
    designer_id?: number | null;
    pedido_status_id?: number | null;
    pedido_tipo_id?: number | null;
    observacoes?: string | null;
    status: string;
    url_trello?: string | null;
    prioridade?: string | null;
    orcamento_id?: number | null;
    tipo_de_pedido: string;
    created_at: Date;
    updated_at: Date;
}

interface Design {
    id: number;
    pedido_arte_final_id: number;
    status: string;
    created_at?: null;
    updated_at?: null;
}

interface Produto {
    uid?: number;
    id: number;
    nome: string;
    esboco: string;
    quantidade: number;
    material: string;
    medida_linear: number;
    preco: number;
    prazo: number;
}


export type { ApiResponsePedidosArteFinal, ArteFinal, Produto };