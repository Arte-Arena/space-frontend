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
  DialogContentText,
  Stack,
  FormControlLabel,
  Checkbox,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { ArteFinal } from "./types";
import { useRouter } from 'next/navigation';
import useAprovarPedidoStatus from './useAprovarPedidoStatus';
import { IconLink, IconTruckDelivery } from "@tabler/icons-react";

// antes de usar isso temos que melhorar o backend pra relacionar as coisas da forma correta nãoa dianta usar as duas tem que focar em uma pra ter segurança quando for atualizar os dados de envio ou recebimento.

interface DialogExpProps {
  openDialogExp: boolean;
  onCloseDialogExp: () => void;
  row: ArteFinal | null;
  refetch: () => void;
}

const DialogExp: React.FC<DialogExpProps> = ({
  openDialogExp,
  onCloseDialogExp,
  row,
  refetch
}) => {
  //handles consts e etc
  const [showInputPeidosStatus, setShowInputPedidosStatus] = useState(false);
  const [hasEntrega, setHasEntrega] = useState(false);
  const [hasEnvio, setHasEnvio] = useState(false);
  const [HasRecebimento, setHasRecebimento] = useState(false);
  const [copiedRastreio, setCopiedRastreio] = useState(false);
  const [handleMakePedidoLoading, setIsLoadingMakePeido] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValueEntrega, setInputValueEntrega] = useState(row?.codigo_rastreamento || '');

  console.log("row: " , row)
  const theme = useTheme()
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const handleSubmmitEntrega = (inputValueEntrega: string) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API}/api/pedidos/pedido-codigo-rastreamento/`, // Corrigir a URL e fazer rota no backend, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          pedido_id: row?.id,
          codigo_rastreamento: inputValueEntrega,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao enviar código de rastreamento'); // Corrigi erro de digitação na mensagem
        }
        return res.json();
      })
      .then((data) => {
        console.log('Código de rastreamento enviado com sucesso:', data);
        setHasEntrega(true);
        refetch();
      })
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
      });
  };

  const handleOpenRastreamentoInterno = (id: string | number | undefined) => {
    const link = window.location.origin + '/apps/producao/expedicao/rastreamento-interno/' + id;
    window.open(link, "_blank");
  }

  const handleOpenRastreamentoCliente = (id: string | number | undefined) => {
    // window.location.href = '/apps/producao/expedicao-cliente/' + id;

    const textToCopy = window.location.origin + "/apps/producao/expedicao/rastreamento-cliente/" + id;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedRastreio(true);
        setTimeout(() => setCopiedRastreio(false), 2000); // Reseta a mensagem após 2 segundos
      })
      .then(() => {
        alert('Link copiado com sucesso');
      })
      .catch((err) => console.error("Erro ao copiar texto:", err));
  }

  const handleAprovaEnvio = (id: string | number | undefined) => {
    const status = "envio";
    useAprovarPedidoStatus(status, id);
    refetch();
    // setHasEnvio(true);
  }

  const handleAprovaRecebimento = (id: string | number | undefined) => {
    const status = "recebimento";
    useAprovarPedidoStatus(status, id);
    refetch();
    // setHasRecebimento(true);
  }

  return (
    <Dialog open={openDialogExp} onClose={onCloseDialogExp}>
      <>
        <DialogTitle>Pedido N° {row?.numero_pedido?.toString()}</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <DialogContentText>Página do rastreio</DialogContentText>
            <Button
              variant="contained"
              color="info"
              // disabled={!hasEntrega}
              onClick={() => handleOpenRastreamentoInterno(row?.id ?? 0)}
            >
              Página do rastreio <IconTruckDelivery style={{ marginLeft: '5px' }} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              // disabled={!hasEntrega}
              sx={{ color: theme.palette.text.primary }}
              onClick={() => handleOpenRastreamentoCliente(row?.orcamento_id ?? 0)}
            >
              Link do rastreio <IconLink style={{ marginLeft: '5px' }} />
            </Button>
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={showInput}
                onChange={(event) => setShowInput(event.target.checked)}
              />
            }
            label="Adicionar Código de rastreio"
          />
          {showInput && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Código de Rastreamento"
                value={inputValueEntrega}
                onChange={(event) => setInputValueEntrega(event.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={hasEntrega}
                onClick={() => handleSubmmitEntrega(inputValueEntrega)}
              >
                Enviar
              </Button>
            </Stack>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={showInputPeidosStatus}
                onChange={(event) => setShowInputPedidosStatus(event.target.checked)}
              />
            }
            label="Aprovar envio ou recebimento do pedido"
          />
          {showInputPeidosStatus && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={row?.pedido_status_id == 14 || row?.pedido_status_id == 15}
                onClick={() => handleAprovaEnvio(row?.id)}
              >
                Aprovar envio do pedido à transportadora
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={row?.pedido_status_id == 15}
                onClick={() => handleAprovaRecebimento(row?.id)}
              >
                Aprovar recebimento do pedido pelo cliente
              </Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialogExp} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </>
    </Dialog>
  )
}

export default DialogExp;
