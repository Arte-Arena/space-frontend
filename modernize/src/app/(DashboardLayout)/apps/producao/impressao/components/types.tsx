interface ApiResponsePedidosArteFinal {
    data: ArteFinal[];
    total: number;
}


interface ArteFinal {
    id?: number;
    user_id?: number | null;
    numero_pedido: Number;
    data_prevista: Date;
    prazo_arte_final: Date;
    prazo_confeccao: Date;
    lista_produtos: Produto[];
    impressao?: Impressao;
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

interface Impressao {
    id: number;
    pedido_arte_final_id?: number;
    impressora?: number | null; // dependendo se o valor for numérico ou nome da impressora
    tipo_corte?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
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

interface User {
    id: number;
    name: string;
    role_id: number;
}

interface PedidoStatus {
    id: number;
    nome: string;
    fila: string;
}

interface PedidoTipo {
    id: number;
    nome: string;
}

export type { ApiResponsePedidosArteFinal, ArteFinal, Produto, User, PedidoStatus, PedidoTipo };