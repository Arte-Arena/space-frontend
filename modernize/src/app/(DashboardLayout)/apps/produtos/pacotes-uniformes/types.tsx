export interface PacoteUniforme {
  id: number;
  nome: string;
  tipo_de_tecido_camisa: string;
  tipo_de_tecido_calcao: string;
  permite_gola_customizada: boolean;
  tipo_gola: string[];
  permite_nome_de_jogador: boolean;
  permite_escudo: boolean;
  tipo_de_escudo_na_camisa: string[];
  tipo_de_escudo_no_calcao: string[];
  patrocinio_ilimitado: boolean;
  patrocinio_numero_maximo: number | null;
  tamanhos_permitidos: string[];
  numero_fator_protecao_uv_camisa: number;
  numero_fator_protecao_uv_calcao: number;
  tipo_de_tecido_meiao: string;
  punho_personalizado: boolean;
  etiqueta_de_produto_autentico: boolean;
  logo_totem_em_patch_3d: boolean;
  selo_de_produto_oficial: boolean;
  selo_de_protecao_uv: boolean;
  created_at: string;
  updated_at: string;
}
