import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SidePanelProps {
  rowId: string | number | null | undefined;
  openDrawer: boolean;
  onCloseDrawer: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ openDrawer, onCloseDrawer }) => {
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
