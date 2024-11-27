'use client'
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

const ContasPagarReceberAdicionarScreen = () => {
  return (
    <PageContainer title="Contas a Pagar e a Receber / Relatórios" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Relatórios" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Relatórios" />
      <ParentCard title="Relatórios">
        <>
          olá.
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;
