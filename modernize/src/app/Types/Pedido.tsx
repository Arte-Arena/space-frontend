export default interface Pedido {
    id: number;
    user_id?: number | null;
    numero_pedido?: string | null;
    data_prevista?: string | null;
    lista_produtos: any;
    observacoes?: string | null;
    rolo?: string | null;
    designer_id?: number | null;
    pedido_status_id?: number | null;
    pedido_tipo_id?: number | null;
    estagio?: string | null;
    url_trello?: string | null;
    situacao?: string | null;
    prioridade?: string | null;
    orcamento_id?: number | null;
    created_at?: string;
    updated_at?: string;
}