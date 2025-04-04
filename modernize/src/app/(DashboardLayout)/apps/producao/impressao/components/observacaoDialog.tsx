import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { ArteFinal } from "./types";
import { useRouter } from 'next/navigation';

interface DialogObsProps {
  openDialogObs: boolean;
  onCloseDialogObs: () => void;
  row: ArteFinal | null;
  refetch: () => void;

}

const DialogObs: React.FC<DialogObsProps> = ({
  openDialogObs,
  onCloseDialogObs,
  row,
  refetch
}) => {
  const [observacoes, setObservacoes] = useState<string | null>(null);
  const router = useRouter();

  const handleObsChange = () => {
    if (!row?.id) {
      console.error("ID do pedido não encontrado");
      return;
    }

    // Chamada para a API para atribuir o designer ao pedido
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Usuário não autenticado");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-obs-change/${row.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ observacoes: observacoes }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atribuir designer');
        }
        return response.json();
      })
      .then(data => {
        console.log('Designer atribuído com sucesso:', data);
        refetch();
      })
      .catch(error => {
        console.error('Erro:', error);
      });

    onCloseDialogObs();
  };

  return (
    <Dialog open={openDialogObs} onClose={onCloseDialogObs} fullWidth >
      <DialogTitle>Atribuir Observação</DialogTitle>
      <DialogContent sx={{ minHeight: 'fitContent', paddingTop: 2 }}>
        <FormControl fullWidth>
          <TextField
            sx={{ marginTop: 1, marginBottom: 2 }}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Digite aqui suas Observações"
            fullWidth
          />
        </FormControl>
        {row?.observacoes && (
          <Box>
            <Typography sx={{fontSize: '16px', marginBottom: '1rem'}}>
              Observação antiga
            </Typography>
            <Typography
              paragraph
              sx={{
                color: 'text.secondary',
                fontSize: '14x',
                lineHeight: '1.6',
              }}
            >
              {row?.observacoes}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialogObs} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleObsChange} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogObs;
