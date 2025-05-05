import React from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

export interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
  onClose: () => void;
  autoHideDuration?: number;
}

export default function NotificationSnackbar({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(4px)',
          backgroundColor:
            severity === 'success'
              ? 'rgba(46, 125, 50, 0.9)'
              : 'rgba(211, 47, 47, 0.9)',
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={false}
        sx={{
          width: '100%',
          alignItems: 'center',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'common.white',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}