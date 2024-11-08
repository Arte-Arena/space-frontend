'use client'
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/app/components/shared/ParentCard';

const ContasPagarReceberAdicionarScreen = () => {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data_vencimento, setDataVencimento] = useState('');
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await fetch('http://api-homolog.spacearena.net/api/conta', {
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

          <CustomFormLabel
            htmlFor="tipo"
          >
            Tipo
          </CustomFormLabel>
          <CustomSelect
            fullWidth
            id="tipo"
            variant="outlined"
            sx={{
              mb: '10px',
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTipo(e.target.value)}
          >
            <option value="Pendente">A Pagar</option>
            <option value="Pago">A Receber</option>
          </CustomSelect>

          <CustomFormLabel
            htmlFor="status"
          >
            Status
          </CustomFormLabel>
          <CustomSelect
            fullWidth
            id="status"
            variant="outlined"
            sx={{
              mb: '10px',
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
          >
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Recebido">Recebido</option>
          </CustomSelect>

          <div style={{ marginTop: '20px' }}>
            <Button 
              color="primary" 
              variant="contained"
              type="submit"

            >
              Adicionar Conta
            </Button>
          </div>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;
