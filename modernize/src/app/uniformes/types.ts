export interface Column {
  id: number;
  name: string;
  type: "select" | "text" | "number";
  options?: string[];
}

export interface TableRow {
  id: number;
  data: string[];
  confirmed: boolean;
}

export interface TableData {
  [key: string]: TableRow[];
}