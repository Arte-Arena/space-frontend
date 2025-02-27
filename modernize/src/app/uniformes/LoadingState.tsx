import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";

interface LoadingStateProps {
  isSuccess: boolean;
  isLoading: boolean;
  onRetry?: () => void;
}

export const LoadingState = ({ isSuccess, isLoading, onRetry }: LoadingStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2
      }}
    >
      {isSuccess ? (
        <>
          <CheckCircle color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h6" color="success.main">
            Uniformes confirmados com sucesso!
          </Typography>
        </>
      ) : isLoading ? (
        <CircularProgress size={60} />
      ) : (
        <>
          <ErrorIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h6" color="error">
            Erro ao confirmar uniformes
          </Typography>
          {onRetry && (
            <Button variant="contained" color="primary" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </>
      )}
    </Box>
  );
};