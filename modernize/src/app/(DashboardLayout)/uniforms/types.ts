export type PackageType =
  | "Start"
  | "Prata"
  | "Ouro"
  | "Diamante"
  | "Premium"
  | "Profissional";

export type Gender = "masculino" | "feminino" | "infantil";

export interface Player {
  gender: string;
  name: string;
  shirt_size: string;
  number: string;
  shorts_size: string;
  ready: boolean;
  observations?: string;
}

export interface Sketch {
  id: string;
  player_count: number;
  package_type: PackageType;
  players: Player[];
}

export interface UniformData {
  id: string;
  client_id: string;
  budget_id: number;
  sketches: Sketch[];
  editable: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  data: UniformData[];
  message?: string;
} 