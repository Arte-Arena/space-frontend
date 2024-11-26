'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button, Select, MenuItem, FormControl } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ContasPagarReceberAdicionarScreen = () => {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data_vencimento, setDataVencimento] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  useEffect(() => {
    if (tipo === 'a pagar') {
      setStatusOptions(['pendente', 'pago']);
    } else if (tipo === 'a receber') {
      setStatusOptions(['pendente', 'recebido']);
    }
  }, [tipo]);

  const handleSubmit = async () => {

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/conta`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conta_titulo: titulo,
          conta_descricao: descricao,
          conta_valor: parseFloat(valor),
          conta_data_vencimento: data_vencimento,
          conta_status: status,
          conta_tipo: tipo,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error('Failed to create account');
      }

      console.log('Account created successfully');
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta" >
        <div>
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
            sx={{
              mt: 0,
            }}
            htmlFor="titulo"
          >
            Descrição
          </CustomFormLabel>
          <CustomTextField
            id="descricao"
            helperText="Descrição da conta."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Data de Vencimentsss"
              value={data_vencimento}
              onChange={(newValue) => {
                setDataVencimento(newValue ?? '');
              }}
              renderInput={(params) => <CustomTextField {...params} 
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: (theme: any) =>
                    `${
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.12) !important'
                        : '#dee3e9 !important'
                    }`,
                },

                "& .MuiFormLabel-colorPrimary": { 
                  color: (theme: any) =>
                    `${
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.12) !important'
                        : '#dee3e9 !important'
                    }`,
                 },
              }}
              />}
              inputFormat="dd/MM/yyyy"
            />
          </LocalizationProvider>


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
            <CustomSelect
              id="status"
              value={status}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecione um status
              </MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
          <div style={{ marginTop: '20px' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Adicionar Conta
            </Button>
          </div>
        </div>
      </ParentCard>
    </PageContainer >
  );
};

export default ContasPagarReceberAdicionarScreen;
