import React, { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogProps,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { IconCopy, IconFileTypePdf, IconCreditCard } from '@tabler/icons-react';
import { NumericFormat } from 'react-number-format';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import formatarPDF from '@/utils/formatarPDF';

interface BudgetDialogProps {
  open: boolean;
  onClose: () => void;
  orcamentoTexto: string;
  address: string;
  totalProductsValue: number | null;
  accessToken: string | null;
  orcamentoId: number | null;
}

const BudgetDialog = ({ open, onClose, orcamentoTexto, address, totalProductsValue, accessToken, orcamentoId }: BudgetDialogProps) => {
  const [scroll] = useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = useRef<HTMLElement>(null);
  const [openSnackbarCopiarOrcamento, setOpenSnackbarCopiarOrcamento] = useState(false);
  const [openSnackbarCopiarLinkPagamento, setOpenSnackbarCopiarLinkPagamento] = useState(false);
  const [checkoutValue, setCheckoutValue] = useState<number | null>(null);
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null);
  const [isGeneratingCheckoutLink, setIsGeneratingCheckoutLink] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'inter'>('mercadopago');

  React.useEffect(() => {
    if (totalProductsValue) {
      setCheckoutValue(totalProductsValue);
    }
  }, [totalProductsValue]);

  React.useEffect(() => {
    if (!checkoutValue || !totalProductsValue) return;
    if (checkoutValue >= totalProductsValue) return setCheckoutValue(totalProductsValue);
    setCheckoutLink(null);
  }, [checkoutValue, totalProductsValue]);

  const handleCloseSnackbarCopiarOrcamento = () => {
    setOpenSnackbarCopiarOrcamento(false);
  };

  const handleCloseSnackbarCopiarLinkPagamento = () => {
    setOpenSnackbarCopiarLinkPagamento(false);
  };

  const handleGenerateCheckoutLink = async () => {
    if (!checkoutValue || checkoutValue <= 0 || !orcamentoId) return;
    
    setIsGeneratingCheckoutLink(true);
    
    try {
      if (paymentMethod === 'mercadopago') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/payment/generate-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ 
            valor: checkoutValue,
            orcamento_id: orcamentoId
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao gerar link de pagamento');
        }

        const data = await response.json();
        setCheckoutLink(data.checkout_link);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockInterLink = `https://banco.inter.com.br/pix/checkout/${Math.random().toString(36).substring(7)}`;
        setCheckoutLink(mockInterLink);
      }
      
      navigator.clipboard.writeText(checkoutLink || '');
      setOpenSnackbarCopiarLinkPagamento(true);
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
    } finally {
      setIsGeneratingCheckoutLink(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll={scroll}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">Orçamento Arte Arena</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <pre>{orcamentoTexto}</pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="payment-method-label">Método de pagamento</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentMethod}
                label="Método de Pagamento"
                onChange={(e) => {
                  setPaymentMethod(e.target.value as 'mercadopago' | 'inter');
                  setCheckoutLink(null);
                }}
              >
                <MenuItem value="mercadopago">Mercado Pago</MenuItem>
                <MenuItem value="inter">Banco Inter</MenuItem>
              </Select>
            </FormControl>

            <NumericFormat
              value={checkoutValue}
              onValueChange={(values) => {
                const newValue = values.floatValue ?? 0;
                if (!totalProductsValue) return setCheckoutValue(0);
                setCheckoutValue(newValue);
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              customInput={CustomTextField}
              size="small"
              style={{ width: '150px' }}
            />
            
            {!checkoutLink ? (
              <Button
                variant="contained"
                onClick={handleGenerateCheckoutLink}
                disabled={isGeneratingCheckoutLink || !checkoutValue || checkoutValue <= 0}
                startIcon={isGeneratingCheckoutLink ? <CircularProgress size={20} /> : <IconCreditCard />}
              >
                Gerar link de checkout
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <IconButton onClick={() => {
                  navigator.clipboard.writeText(checkoutLink);
                  setOpenSnackbarCopiarLinkPagamento(false);
                  setTimeout(() => setOpenSnackbarCopiarLinkPagamento(true), 10);
                }}>
                  <IconCopy />
                  <Typography variant="body2">Copiar link do checkout</Typography>
                </IconButton>
                {openSnackbarCopiarLinkPagamento && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '100%',
                      backgroundColor: 'success.main',
                      color: 'white',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      marginRight: '10px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.8rem',
                      boxShadow: 2,
                      animation: 'fadeIn 0.3s, fadeOut 0.5s 1.5s forwards',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 },
                      },
                      '@keyframes fadeOut': {
                        '0%': { opacity: 1 },
                        '100%': { opacity: 0 },
                      }
                    }}
                  >
                    Link copiado!
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <IconButton onClick={() => { navigator.clipboard.writeText(orcamentoTexto); setOpenSnackbarCopiarOrcamento(true); }}>
            <IconCopy />
            <Typography variant="body2">Copiar Orçamento</Typography>
          </IconButton>

          <IconButton
            onClick={() => {
              const htmlContent = `
                <style>
                  body {
                    color: black !important;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                  }
                  p {
                    margin: 0;
                  }
                </style>
                <div>
                  <p><pre>${orcamentoTexto}</pre></p>
                </div>
              `;
              formatarPDF(htmlContent, address);
            }}
          >
            <IconFileTypePdf />
            <Typography variant="body2">Exportar PDF</Typography>
          </IconButton>

          <Button autoFocus onClick={onClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbarCopiarOrcamento}
        onClose={handleCloseSnackbarCopiarOrcamento}
        key={'orcamento' + 'copiado'}
      >
        <Alert onClose={handleCloseSnackbarCopiarOrcamento} severity="success" sx={{ width: '100%' }}>
          Orçamento copiado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default BudgetDialog;