'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

interface DialogEntregaProps {
  handleCloseDialog: () => void;
  dialogOpen: boolean;

}

const DialogEntrega: React.FC<DialogEntregaProps> = ({
  handleCloseDialog,
  dialogOpen,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Alterar Status</DialogTitle>
      <DialogContent>
        <Typography sx={{ marginBottom: '10px' }}>
            a
        </Typography>
        <DialogContentText>Selecione a ação desejada para o status:</DialogContentText>
        <Typography>Status atual: a</Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
          >
            Aprovar
          </Button>
          <Button
            variant="contained"
            color="error"
          >
            Desaprovar
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEntrega;