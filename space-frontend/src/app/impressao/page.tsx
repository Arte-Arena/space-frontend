import React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OrcamentoClienteBusca from "@/components/OrcamentoClienteBusca";

export default function ImpressaoScreen() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ color: 'primary.contrastText' }}>
          <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1 }} />
            Início
          </Link>

          <Link underline="hover" key="2" color="inherit" href="/orcamento">
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            Impressão
          </Link>
        </Breadcrumbs>
      </Box>
      
      <OrcamentoClienteBusca />

    </>
  );
}
