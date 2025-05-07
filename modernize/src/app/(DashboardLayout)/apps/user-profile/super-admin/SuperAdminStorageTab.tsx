import React from 'react';
import Typography from '@mui/material/Typography';
import SuperAdminStorageTabSubTab from './SuperAdminStorageTabSubTabs';

const SuperAdminStorageTab = () => {


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
          Controle de Armazenamento
        </Typography>

        <SuperAdminStorageTabSubTab />

      </div>
    </>
  );
};

export default SuperAdminStorageTab;
