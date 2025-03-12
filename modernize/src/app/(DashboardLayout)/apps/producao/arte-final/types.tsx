
interface ArteFinal {
  id?: number;
  user_id?: number | null;
  numero_pedido: Number | undefined;
  data_entrega: Date | null;
  prazo_arte_final: Number;
  prazo_confeccao: Number;
  lista_produtos: Produto[];
  rolo: string;
  estagio?: string | null;
  designer_id?: number | null;
  pedido_status_id?: number | null;
  pedido_tipo_id?: number | null;
  observacoes?: string | null;
  url_trello?: string | null;
  prioridade?: string | null;
  orcamento_id?: number | null;
  created_at: Date;
  updated_at: Date;
}

interface Produto {
  uid?: number;
  id: number;
  nome: string;
  esboco: string;
  quantidade: number;
  material: string | undefined;
  medida_linear: number;
  preco: number;
  prazo: number;
}

interface User{
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

export type { ArteFinal, Produto, User, PedidoStatus, PedidoTipo };



