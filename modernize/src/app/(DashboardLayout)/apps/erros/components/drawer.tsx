import React from "react";
import { Drawer, Box, Typography, IconButton, Card, CardContent, Divider, Table, TableBody, TableRow, TableCell, TableHead, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Erros, Produto } from "./types";
import { format } from "date-fns";
import { useThemeMode } from "@/utils/useThemeMode";
import { IconExclamationCircle } from "@tabler/icons-react";

interface SidePanelProps {
  row: Erros | null;
  openDrawer: boolean;
  onCloseDrawer: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ row, openDrawer, onCloseDrawer }) => {
  const theme = useThemeMode();
  const status = row?.status;

  const handleErrorPedido = () => {
    const confirm = window.confirm('deseja editar o erro ' + row?.id + '?');
    if (confirm) {
      window.open(`../apps/erros/edit/${row?.id}`, '_blank');
    }
    return;
  };

  return (
    <Drawer
      anchor="right" // Abre na lateral direita
      open={openDrawer}
      onClose={onCloseDrawer}
      PaperProps={{
        sx: { width: "45vw", padding: 2 }, // Largura de 40% da tela
      }}
    >
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0}>
        <Typography variant="h5" fontWeight="bold">
          {row?.numero_pedido ? "Detalhes do Erro do Pedido N°" + row?.numero_pedido : "Detalhes do Erro N°" + row?.id}
          <Tooltip title="Adicionar Erro ao pedido">
            <IconButton onClick={handleErrorPedido} color="primary">
              <IconExclamationCircle />
            </IconButton>
          </Tooltip>
        </Typography>

        <IconButton onClick={onCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{}}>
        {/* Seção de Datas */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📅 Datas</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>
              <strong>Criação do Erro:</strong> <span style={{ fontWeight: 500 }}>
                {row?.created_at ? format(new Date(row.created_at), "dd/MM/yyyy") : "Data inválida"}
              </span>
            </Typography>
            <Typography>
              <strong>Última Atualização:</strong> <span style={{ fontWeight: 500 }}>
                {row?.updated_at ? format(new Date(row.updated_at), "dd/MM/yyyy") : "Data inválida"}
              </span>
            </Typography>
          </CardContent>
        </Card>

        {/* Seção de Status */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📌 Status</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>
              <strong>Status do Erro:</strong> <span style={{ fontWeight: 500 }}>{status}</span>
            </Typography>
          </CardContent>
        </Card>

        {/* Seção de Detalhes */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📝 Detalhes</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography sx={{ fontWeight: 500 }}>{row?.detalhes || "Nenhuma observação disponível."}</Typography>
          </CardContent>
        </Card>

        {/* URL do Trello */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">🔗 Trello</Typography>
            <Divider sx={{ mb: 1 }} />
            {row?.link_trello ? (
              <a href={row.link_trello} style={{ fontWeight: 500, color: theme === 'dark' ? 'rgb(0, 255, 255)' : 'blue' }} target="_blank" rel="noopener noreferrer">
                Acessar Trello
              </a>
            ) : (
              <Typography sx={{ fontWeight: 500, color: theme === 'dark' ? 'rgb(0, 255, 255)' : 'blue' }}>Nenhuma URL disponível.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
};

export default SidePanel;
