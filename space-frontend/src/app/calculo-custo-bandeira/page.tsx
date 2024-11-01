
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Typography } from '@mui/material';

export default function CalculoCustoBandeiraScreen() {
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
            Cálculo de Custo de Bandeira
          </Link>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" sx={{ color: 'primary.contrastText' }}>
        Para calcular o custo da bandeira, é necessário informar os seguintes requisitos:
      </Typography>

    </>
  );
}
