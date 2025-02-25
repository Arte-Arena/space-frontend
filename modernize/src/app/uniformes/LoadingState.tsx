import { Box, CircularProgress, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

interface LoadingStateProps {
  isSuccess: boolean;
}

export const LoadingState = ({ isSuccess }: LoadingStateProps) => {
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
      ) : (
        <CircularProgress size={60} />
      )}
    </Box>
  );
};