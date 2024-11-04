'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Typography } from '@mui/material';

interface Conta {
  id: number;
  titulo: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: string;
  tipo: string;
}

function ContasPagarReceberScreen() {

  const [contas, setContas] = React.useState<Conta[]>([]);


  React.useEffect(() => {
    async function fetchContas() {
      try {
        const response = await fetch('http://localhost:8000/api/conta', {
          headers: {
            Authorization: 'Bearer 1|1kzSFsZLFJ4KtS3G2AaRvhaqvDMnLYGqD8jK0rL3150e1cc9'
          }
        });
        const json = await response.json();
        // Acesse o array dentro de `data` e defina-o como o estado
        setContas(Array.isArray(json.data) ? json.data : []);
      } catch (error) {
        console.error('Erro ao buscar contas:', error);
      }
    }
    fetchContas();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ color: 'primary.contrastText' }}>
          <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1 }} />
            Início
          </Link>

          <Link underline="hover" key="2" color="inherit" href="/contas-pagar-receber">
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            Contas a Pagar e a Receber
          </Link>
        </Breadcrumbs>
      </Box>

      <Typography variant="h2" sx={{ color: 'primary.contrastText' }}>
        Contas a Pagar e a Receber
      </Typography>




      <Typography variant="body1" sx={{ color: 'primary.contrastText' }}>
        Contas:
      </Typography>
      <ul>
        {contas.map((conta) => (
          <li key={conta.id}>{conta.titulo} - {conta.valor}</li>
        ))}
      </ul>



    </>
  );
}

export default ContasPagarReceberScreen;
