'use client'
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button, Snackbar, Select, MenuItem, FormControl } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/app/components/shared/ParentCard';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ContasPagarReceberAdicionarScreen = () => {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data_vencimento, setDataVencimento] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    console.log({
      titulo,
      descricao,
      valor: parseFloat(valor),
      data_vencimento,
      status,
      tipo,
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          valor: parseFloat(valor),
          data_vencimento,
          status,
          tipo,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error('Failed to create account');
      }

      console.log('Account created successfully');
      setOpenSnackbar(true);


    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta" >
        <form style={{ maxWidth: '600px' }} action="" onSubmit={handleSubmit}>


          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="titulo"
          >
            Título
          </CustomFormLabel>
          <CustomTextField
            id="titulo"
            helperText="Título da conta a pagar ou a receber."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
          />

          <CustomFormLabel
            htmlFor="valor"
          >Valor</CustomFormLabel>
          <CustomTextField
            id="valor"
            helperText="Valor em reais da conta a pagar ou a receber."
            variant="outlined"
            fullWidth
            sx={{
              mb: '10px',
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
          />

          <CustomFormLabel
            htmlFor="data_vencimento"
          >
            Data de Vencimento
          </CustomFormLabel>
          <CustomTextField
            id="data_vencimento"
            type="date"
            helperText="Data de vencimento da conta a pagar ou a receber."
            variant="outlined"
            fullWidth
            sx={{
              mb: '10px',
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataVencimento(e.target.value)}
          />

          <CustomFormLabel htmlFor="tipo">
            Tipo
          </CustomFormLabel>
          <FormControl fullWidth variant="outlined" sx={{ mb: '10px' }}>
            <Select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as string)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione um tipo
              </MenuItem>
              <MenuItem value="a pagar">A Pagar</MenuItem>
              <MenuItem value="a receber">A Receber</MenuItem>
            </Select>
          </FormControl>

          <CustomFormLabel htmlFor="status">
            Status
          </CustomFormLabel>
          <FormControl fullWidth variant="outlined" sx={{ mb: '10px' }}>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as string)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione um status
              </MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="pago">Pago</MenuItem>
              <MenuItem value="recebido">Recebido</MenuItem>
            </Select>
          </FormControl>

          <div style={{ marginTop: '20px' }}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={handleSubmit}
            >
              Adicionar Conta
            </Button>
          </div>
        </form>
      </ParentCard>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>

        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' , display: 'flex', justifyContent: 'center' }}>
          Conta criada com sucesso!
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;
