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

interface Pedido {
  id: number;
  orcamento_id: number;
  user_id: number | null;
  numero_pedido: string | null;
  data_prevista: string | null;
  pedido_status_id: number | null;
  pedido_tipo_id: number | null;
  pedido_produto_categoria: string | null;
  pedido_material: string | null;
  rolo: string | null;
  medida_linear: string | null;
  prioridade: string | null;
  estagio: string | null;
  situacao: string | null;
  designer_id: number | null;
  observacoes: string | null;
  codigo_rastreamento: string | null;
  url_trello: string | null;
  created_at: string;
  updated_at: string;
}

interface Produto {
  uid?: number;
  id: number;
  nome: string;
  esboco: string;
  quantidade: number;
  material: Material[];
  medida_linear: number;
  preco: number;
  prazo: number;
}

interface Material {
  id: number;
  descricao: string;
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

export type { ApiResponsePedidosArteFinal, ArteFinal, Produto, Material, User, PedidoStatus, PedidoTipo, Pedido };