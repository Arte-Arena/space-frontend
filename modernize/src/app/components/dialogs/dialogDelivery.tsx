'use client';
import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import { IconTruckDelivery } from '@tabler/icons-react';

interface DialogEntregaProps {
  handleCloseDialog: () => void;
  dialogOpen: boolean;
  dialogData: {
    idPedido: number | null;
    numeroPedido: string | null;
    codigoRastreio: string | null;
  };
}



// /pedidos/pedido-codigo-rastreamento

const DialogEntrega: React.FC<DialogEntregaProps> = ({
  handleCloseDialog,
  dialogOpen,
  dialogData,
}) => {

  const [message, setMessage] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasEntrega, setHasEntrega] = useState(false);

  if (dialogData.codigoRastreio) {
    setHasEntrega(true);
  }


  const handleSubmmit = (inputValue: string) => {
    console.log(inputValue);

    if (inputValue) {
      fetch(`${process.env.NEXT_PUBLIC_API}/pedidos/pedido-codigo-rastreamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cod_rastreamento: inputValue, id: dialogData.idPedido }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMessage('Sucesso ao enviar código de rastreio');
          alert(message);
        })
        .catch((error) => {
          console.error('Erro ao enviar o formulário:', error);
        });
    }
    return;
  };


  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Rastrear Pedido N° {dialogData.numeroPedido}</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <DialogContentText>Pagina do rastreio</DialogContentText>
          <Button
            variant="contained"
            color="success"
            disabled={!hasEntrega}
          >
            <IconTruckDelivery />
          </Button>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={showInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setShowInput(event.target.checked);
              }}
            />
          }
          label="Adicionar Codigo de rastreio"
        />
        {showInput && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Código de Rastreio"
              value={inputValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setInputValue(event.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={hasEntrega}
              onClick={() => {
                console.log('Código de Rastreio: ', inputValue);
                handleSubmmit(inputValue);
                setHasEntrega(true);
              }}
            >
              Enviar
            </Button>
          </Stack>
        )}
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