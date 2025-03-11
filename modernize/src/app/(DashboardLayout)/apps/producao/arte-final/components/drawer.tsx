import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ArteFinal } from "./types";

interface SidePanelProps {
  row: ArteFinal | null;
  openDrawer: boolean;
  onCloseDrawer: () => void;
}

const pedidoTipos = {
  1: 'Prazo normal',
  2: 'Antecipação',
  3: 'Faturado',
  4: 'Metade/Metade',
  5: 'Amostra',
} as const;

const pedidoStatus = {
  1: { nome: 'Pendente', fila: 'D' },
  2: { nome: 'Em andamento', fila: 'D' },
  3: { nome: 'Arte OK', fila: 'D' },
  4: { nome: 'Em espera', fila: 'D' },
  5: { nome: 'Cor teste', fila: 'D' },
  8: { nome: 'Pendente', fila: 'I' },
  9: { nome: 'Processando', fila: 'I' },
  10: { nome: 'Renderizando', fila: 'I' },
  11: { nome: 'Impresso', fila: 'I' },
  12: { nome: 'Em Impressão', fila: 'I' },
  13: { nome: 'Separação', fila: 'I' },
  14: { nome: 'Em Transporte', fila: 'E' },
  15: { nome: 'Entregue', fila: 'E' },
} as const;


const SidePanel: React.FC<SidePanelProps> = ({ row,  openDrawer, onCloseDrawer }) => {
  // console.log('ROW DRAWER: ', row);
  return (
    <Drawer
      anchor="right" // Abre na lateral direita
      open={openDrawer}
      onClose={onCloseDrawer}
      PaperProps={{
        sx: { width: "40vw", padding: 2 }, // Largura de 40% da tela
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Informações</Typography>

        <Box>
          <Typography variant="body1">ID: {row?.id}</Typography>
          {/* <Typography variant="body1">Pedido: {row?.numero_pedido}</Typography> */}
        </Box>

        <IconButton onClick={onCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="body1">
        Aqui você pode exibir qualquer conteúdo necessário.
      </Typography>
    </Drawer>
  );
};

export default SidePanel;
