import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, useTheme, IconButton, Stack } from '@mui/material';
import { Transaction } from './types';
import { GridCloseIcon } from '@mui/x-data-grid';

interface TransactionDetailsProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ open, onClose, transaction }) => {
  if (!transaction) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const theme = useTheme();

  const renderMercadoPagoDetails = (detalhes: any) => (
    <Grid container spacing={3}>

      <Grid item xs={6}>
        <Grid item xs={12}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Detalhes do Mercado Pago
          </Typography>
        </Grid>
        <Stack spacing={1.5}>
          <Typography fontSize="1.0rem">
            <strong>ID da Transação:</strong> {detalhes.id || 'N/A'}
          </Typography>
          <Typography fontSize="1.0rem">
            <strong>Status MP:</strong> {detalhes.status || 'N/A'}
          </Typography>
          <Typography fontSize="1.0rem">
            <strong>Método de Pagamento:</strong> {detalhes.payment_method?.id || 'N/A'}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={6}>
        <Stack spacing={1.5}>
          <Typography fontSize="1.0rem">
            <strong>Valor da Transação:</strong> R$ {detalhes.transaction_amount?.toFixed(2) || '0.00'}
          </Typography>
          <Typography fontSize="1.0rem">
            <strong>Data Criação:</strong> {formatDate(detalhes.date_created)}
          </Typography>
          <Typography fontSize="1.0rem">
            <strong>Modo Live:</strong> {detalhes.live_mode ? 'Sim' : 'Não'}
          </Typography>
        </Stack>
      </Grid>

      {detalhes.payer && (
        <Grid item xs={12}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Informações do Pagador
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={1.5}>
                <Typography fontSize="1.0rem">
                  <strong>ID:</strong> {detalhes.payer.id || 'N/A'}
                </Typography>
                <Typography fontSize="1.0rem">
                  <strong>Email:</strong> {detalhes.payer.email || 'N/A'}
                </Typography>
                <Typography fontSize="1.0rem">
                  <strong>Nome:</strong> {detalhes.payer.first_name || 'N/A'} {detalhes.payer.last_name || ''}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[5],
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        Detalhes da Transação
        <IconButton onClick={onClose} sx={{ color: theme.palette.common.white }}>
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 4, mt: 3 }}>
        {transaction ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography fontSize="1.0rem">
                    <strong>ID:</strong> #{transaction.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontSize="1.0rem">
                    <strong>Status:</strong> {transaction.status}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {transaction.plataforma === 'mercado_pago' && transaction.detalhes ? (
                renderMercadoPagoDetails(transaction.detalhes)
              ) : (
                <Typography fontSize="1.0rem" color="textSecondary">
                  Nenhum detalhe específico da plataforma disponível
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                Informações Adicionais
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Stack spacing={1.5}>
                    <Typography fontSize="1.0rem">
                      <strong>Data Transação:</strong> {formatDate(transaction.data_transacao)}
                    </Typography>
                    <Typography fontSize="1.0rem">
                      <strong>Data Lançamento:</strong> {formatDate(transaction.data_lancamento)}
                    </Typography>
                    <Typography fontSize="1.0rem">
                      <strong>Valor Líquido:</strong> R$ {parseFloat(transaction.valor_liquido || '0').toFixed(2)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1.5}>
                    <Typography fontSize="1.0rem">
                      <strong>Categoria:</strong> {transaction.categoria || 'N/A'}
                    </Typography>
                    <Typography fontSize="1.0rem">
                      <strong>Conciliado:</strong> {transaction.conciliado ? 'Sim' : 'Não'}
                    </Typography>
                    <Typography fontSize="1.0rem">
                      <strong>Fonte de Dados:</strong> {transaction.fonte_dados}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Typography fontSize="1.0rem">Carregando detalhes...</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;