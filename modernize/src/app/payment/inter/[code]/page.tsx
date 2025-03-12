'use client';

import { Box, Grid, Typography, Stack, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { QRCodeSVG } from 'qrcode.react';
import BlankCard from '@/app/components/shared/BlankCard';
import { IconButton } from '@mui/material';
import { useState } from 'react';

type PageProps = {
  params: {
    code: string;
  };
};

const mockPaymentData = {
  qrCodeData: "00020101021226870014br.gov.bcb.pix2565qrcodes-pix.gerencianet.com.br/v2/45c78475f2044708a33f239fc705994c520400005303986540510.005802BR5914ArtArena Store6009SAO PAULO62140510U9yyHcMHlI63040F2F",
  pixCopyPaste: "00020101021226870014br.gov.bcb.pix2565qrcodes-pix.gerencianet.com.br/v2/45c78475f2044708a33f239fc705994c520400005303986540510.005802BR5914ArtArena Store6009SAO PAULO62140510U9yyHcMHlI63040F2F",
  bankSlipCode: "34191.79001 01043.510047 91020.150008 4 93920026000",
  amount: 150.00,
  expiresAt: "2024-03-10T23:59:59"
};

export default function Payment({ params }: PageProps) {
  const paymentId = params.code;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(`${type} copiado com sucesso!`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      minHeight: '100vh',
      pb: { xs: 8, sm: 6 },
      bgcolor: 'grey.100' 
    }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <BlankCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" textAlign="center" gutterBottom>
                Pagamento - Arte Arena
              </Typography>
              
              <Typography variant="h5" color="primary" textAlign="center" gutterBottom>
                R$ {mockPaymentData.amount.toFixed(2)}
              </Typography>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  PIX QR Code
                </Typography>
                <Box display="flex" justifyContent="center" mb={3}>
                  <QRCodeSVG value={mockPaymentData.qrCodeData} size={200} />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  PIX Copia e Cola
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      flex: 1,
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}
                  >
                    {mockPaymentData.pixCopyPaste}
                  </Box>
                  <IconButton 
                    onClick={() => handleCopy(mockPaymentData.pixCopyPaste, 'Código PIX')}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Stack>
              </Box>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Código do Boleto
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      flex: 1,
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}
                  >
                    {mockPaymentData.bankSlipCode}
                  </Box>
                  <IconButton 
                    onClick={() => handleCopy(mockPaymentData.bankSlipCode, 'Código do boleto')}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Stack>
              </Box>

              <Box mt={3} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  Expira em: {new Date(mockPaymentData.expiresAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </BlankCard>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
