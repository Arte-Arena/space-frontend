import { Box, Button, Stack, Typography } from "@mui/material";
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export type PageHeaderProps = {
  orderId: string | null;
  onConfirm: () => void;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
};

export function PageHeader({ orderId, onConfirm, isSuccess, isLoading, isError }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 4 }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Image
          src="/images/logos/logoIcon.svg"
          alt="Arte Arena Logo"
          width={40}
          height={40}
        />
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Uniformes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Orçamento #{orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Preencha as informações dos uniformes para cada jogador(a). Clique nos campos para editar.
          </Typography>
        </Box>
      </Stack>

      {!isLoading && !isSuccess && !isError && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CheckCircleIcon />}
          onClick={onConfirm}
          sx={{
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            px: { xs: 2, sm: 3 },
            '& .MuiButton-startIcon': {
              mr: { xs: 0.5, sm: 1 }
            },
            alignSelf: { xs: 'center', sm: 'flex-start' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Confirmar
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Confirmar
          </Box>
        </Button>
      )}
    </Stack>
  );
}