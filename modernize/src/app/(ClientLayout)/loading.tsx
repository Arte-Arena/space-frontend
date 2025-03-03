"use client";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6" mt={2}>
        Carregando...
      </Typography>
    </Box>
  );
};

export default Loading; 