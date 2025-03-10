
interface ArteFinal {
  id?: number;
  user_id?: number | null;
  numero_pedido: Number;
  data_entrega: Date;
  prazo_arte_final: Number;
  prazo_confeccao: Number;
  lista_produtos: Produto[];
  observacao: string;
  rolo: string;
  estagio?: string | null;
  medidaLinear: number | null;
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
  data: [];
  designer: User;
}

interface Data{
  data: ArteFinal[];
}

interface Produto {
  uid?: number;
  id: number;
  nome: string;
  esboco: string;
  quantidade: number;
  materiais: Material[];
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

export type { ArteFinal, Produto, Material, Data, User };



