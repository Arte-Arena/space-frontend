'use client'
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/app/components/shared/ParentCard';

const ContasPagarReceberAdicionarScreen = () => {

  

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta" >
        <form style={{ maxWidth: '600px' }}>


        {/* 'titulo',
        'descricao',
        'valor',
        'data_vencimento',
        'status',
        'tipo', */}
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
          >
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Recebido">Recebido</option>
          </CustomSelect>

          <div style={{ marginTop: '20px' }}>
            <Button color="primary" variant="contained">
              Adicionar Conta
            </Button>
          </div>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;
