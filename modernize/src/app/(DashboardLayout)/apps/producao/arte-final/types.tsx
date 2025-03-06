
interface ArteFinal {
    id?: number;
    numero_pedido: Number;
    data_prevista: Date;
    lista_produtos: Produto[];
    observacao: string;
    rolo: string;
    designer: string;
    status: string;
    tipo_de_pedido: string;
    created_at: Date;
    updated_at: Date;
  }
  
  interface Produto {
    id: number;
    tipo_produto: string;
    materiais: Material[];
    medida_linear: number;
  }

  interface Material {
    id: number;
    material: string;
  }

  export type { ArteFinal, Produto, Material }
  
  

