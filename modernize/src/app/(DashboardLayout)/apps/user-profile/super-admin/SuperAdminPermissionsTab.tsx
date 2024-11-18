import React from 'react';
import Typography from '@mui/material/Typography';
import SuperAdminPermissionsTabSubTabs from './SuperAdminPermissionsTabSubTabs';

const SuperAdminPermissionsTab = () => {


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

        <SuperAdminPermissionsTabSubTabs />

      </div>
    </>
  );
};

export default SuperAdminPermissionsTab;
