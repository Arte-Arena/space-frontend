
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
  designer: string;
  designer_id?: number | null;
  pedido_status_id?: number | null;
  pedido_tipo_id?: number | null;
  observacoes?: string | null;
  status: string;
  url_trello?: string | null;
  situacao?: string | null;
  prioridade?: string | null;
  orcamento_id?: number | null;
  tipo_de_pedido: string;
  created_at: Date;
  updated_at: Date;
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

export type { ArteFinal, Produto, Material }



