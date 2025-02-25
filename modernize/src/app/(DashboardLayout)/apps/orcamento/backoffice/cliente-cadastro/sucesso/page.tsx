'use client'
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const SucessoPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15%',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
          color: theme.palette.common.white,
          padding: '20px',
          borderRadius: '8px',
          fontSize: '4rem',
          '@media (max-width: 600px)': {
            fontSize: '2.5rem', // Responsividade para telas menores
          },
        }}
      >
        Sucesso
      </Typography>
    </Box>
  );
};

export default SucessoPage;

