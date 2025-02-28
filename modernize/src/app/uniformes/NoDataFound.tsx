'use client';

import { Box, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface NoDataFoundProps {
  message: string;
  type?: 'error' | 'info' | 'warning';
  title?: string;
}

const iconMap = {
  error: ErrorOutlineIcon,
  info: InfoOutlinedIcon,
  warning: WarningAmberIcon,
};

const styleMap = {
  error: {
    color: '#DC2626',
    bgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%)'
  },
  info: {
    color: '#2563EB',
    bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)'
  },
  warning: {
    color: '#D97706',
    bgGradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)'
  }
};

export const NoDataFound = ({
  message,
  type = 'info',
  title
}: NoDataFoundProps) => {
  const Icon = iconMap[type];
  const style = styleMap[type];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 360,
          background: style.bgGradient,
          borderRadius: 3,
          position: 'relative',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            sx={{
              fontSize: 48,
              color: style.color,
              opacity: 0.9,
            }}
          />
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            color: style.color,
            mb: 1.5,
            fontWeight: 500,
            letterSpacing: '-0.5px'
          }}
        >
          {title || (type === 'error' ? 'Ops! Algo deu errado' : 'Nenhum dado encontrado')}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            maxWidth: '280px',
            mx: 'auto'
          }}
        >
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};
