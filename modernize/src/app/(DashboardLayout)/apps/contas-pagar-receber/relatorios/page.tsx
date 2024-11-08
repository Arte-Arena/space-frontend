'use client'
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/app/components/shared/ParentCard';

const ContasPagarReceberAdicionarScreen = () => {
  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta">
        <form>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="email-address"
          >
            Email
          </CustomFormLabel>
          <CustomTextField
            id="email-address"
            helperText="We'll never share your email with anyone else."
            variant="outlined"
            fullWidth
          />
          <CustomFormLabel htmlFor="ordinary-outlined-password-input">Password</CustomFormLabel>

          <CustomTextField
            id="ordinary-outlined-password-input"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            sx={{
              mb: '10px',
            }}
          />
          <div>
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
