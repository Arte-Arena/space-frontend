'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Typography, TextField, Button } from '@mui/material';

function CustoBandeiraScreen() {
  const [altura, setAltura] = React.useState('');
  const [largura, setLargura] = React.useState('');
  const [custoTecido, setCustoTecido] = React.useState('');
  const [custoTinta, setCustoTinta] = React.useState('');
  const [custoPapel, setCustoPapel] = React.useState('');
  const [custoImposto, setCustoImposto] = React.useState('');
  const [resultado, setResultado] = React.useState<number | null>(null);

  const calcularCusto = () => {
    // Validação básica (pode ser aprimorada)
    if (!altura || !largura || !custoTecido || !custoTinta || !custoPapel || !custoImposto) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const area = parseFloat(altura) * parseFloat(largura);
    const custoTotalTecido = area * parseFloat(custoTecido);
    const custoTotalTinta = area * parseFloat(custoTinta);
    const custoTotalPapel = area * parseFloat(custoPapel);
    const custoTotalImposto = (custoTotalTecido + custoTotalTinta + custoTotalPapel) * parseFloat(custoImposto);
    const custoFinal = custoTotalTecido + custoTotalTinta + custoTotalPapel + custoTotalImposto;

    setResultado(custoFinal);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ color: 'primary.contrastText' }}>
          <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1 }} />
            Início
          </Link>

          <Link underline="hover" key="2" color="inherit" href="/custo-bandeira">
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            Custo Bandeira
          </Link>
        </Breadcrumbs>
      </Box>

      <Typography variant="body1" sx={{ color: 'primary.contrastText' }}>
        Preencha os dados abaixo para calcular o custo da bandeira:
      </Typography>

      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '100%' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="altura" label="Altura" variant="outlined" value={altura} onChange={(e) => setAltura(e.target.value)} />
        <TextField id="largura" label="Largura" variant="outlined" value={largura} onChange={(e) => setLargura(e.target.value)} />
        <TextField id="custoTecido" label="Custo do Tecido" variant="outlined" value={custoTecido} onChange={(e) => setCustoTecido(e.target.value)} />
        <TextField id="custoTinta" label="Custo da Tinta" variant="outlined" value={custoTinta} onChange={(e) => setCustoTinta(e.target.value)} />
        <TextField id="custoPapel" label="Custo do Papel" variant="outlined" value={custoPapel} onChange={(e) => setCustoPapel(e.target.value)} />
        <TextField id="custoImposto" label="Custo do Imposto" variant="outlined" value={custoImposto} onChange={(e) => setCustoImposto(e.target.value)} />

        <Button variant="contained" onClick={calcularCusto}>Calcular</Button>
      </Box>

      {resultado !== null && (
        <Typography variant="h6" sx={{ color: 'primary.contrastText' }}>
          O custo total da bandeira é: R$ {resultado}
        </Typography>

      )}
    </>
  );
}

export default CustoBandeiraScreen;
