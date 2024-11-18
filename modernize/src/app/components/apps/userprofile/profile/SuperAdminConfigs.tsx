import React from 'react';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
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
          Configurações do Sistema
        </Typography>


        <SuperAdminConfigsTabs />


        {/* <div style={{ marginTop: '20px' }}>
          <ButtonGroup variant="contained" aria-label="contained primary button group">

            <Link href="/superadmin/gerenciar-usuarios">
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/superadmin/gerenciar-usuarios"
              >
                Gerenciar Usuários
              </Button>
            </Link>
            <Link href="/superadmin/gerenciar-papeis">
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/superadmin/gerenciar-usuarios"
              >
                Gerenciar Papéis de Acesso
              </Button>
            </Link>
            <Link href="/superadmin/gerenciar-usuarios">
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/superadmin/gerenciar-usuarios"
              >
                Gerenciar Custos
              </Button>
            </Link>
          </ButtonGroup>
        </div> */}
      </div>
    </>
  );
};

export default SuperAdminConfigs;
