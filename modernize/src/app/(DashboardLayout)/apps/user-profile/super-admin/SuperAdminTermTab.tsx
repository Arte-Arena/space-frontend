import React from 'react';
import Typography from '@mui/material/Typography';
import SuperAdminTermTabSubTabs from './SuperAdminTermTabSubTabs';

const SuperAdminTermTab = () => {


  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Controle de Acessos
        </Typography>

        <SuperAdminTermTabSubTabs />

      </div>
    </>
  );
};

export default SuperAdminTermTab;
