'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ResumoCardProps {
  titulo: string;
  valor: string | number;
  icone: ReactNode;
  cor?: string;
}

const ResumoCard = ({ titulo, valor, icone, cor = '#4dabf5' }: ResumoCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #394457',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: cor,
          borderRadius: '50%',
          color: 'white',
          mr: 2,
        }}
      >
        {icone}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {titulo}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {valor}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResumoCard;
