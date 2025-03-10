'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { Box } from '@mui/material';
import { SearchSection } from './SearchSection';
import { PaymentTable } from './PaymentTable';
import { usePayments } from './usePayments';

const Pagamentos = () => {
  const {
    budgetId,
    isLoading,
    searchPerformed,
    payments,
    error,
    handleSearch,
    handleInputChange,
  } = usePayments();

  return (
    <PageContainer title="Pagamentos" description="Gestão de Pagamentos">
      <Breadcrumb title="Pagamentos" subtitle="Gerencie os pagamentos" />
        <Box sx={{ p: 3 }}>
          <SearchSection
            budgetId={budgetId}
            error={error}
            isLoading={isLoading}
            onSearch={handleSearch}
            onInputChange={handleInputChange}
          />
          
          <PaymentTable
            payments={payments}
            isLoading={isLoading}
            searchPerformed={searchPerformed}
            budgetId={budgetId}
          />
        </Box>
    </PageContainer>
  );
};

export default Pagamentos;
