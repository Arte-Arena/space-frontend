import React from 'react';
import Typography from '@mui/material/Typography';
import SuperAdminConfigsTabs from '@/app/(DashboardLayout)/apps/user-profile/super-admin/SuperAdminConfigsTabs';

const SuperAdminConfigs = () => {


  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Configurações do Space
        </Typography>


        <SuperAdminConfigsTabs />

      </div>
    </>
  );
};

export default SuperAdminConfigs;
