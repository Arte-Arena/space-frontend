'use client'
import React, { useEffect } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { useAuth } from "@/utils/useAuth";
import Box from '@mui/material/Box';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Vendas",
  },
  {
    to: "/apps/vendas/crm/leads",
    title: "Leads",
  },
];

function LeadsScreen() {
  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  return (
    <PageContainer title="Leads" description="Gerenciamento de Leads">
      <Breadcrumb title="Leads" items={BCrumb} />
      <Box>
        <h2>Gerenciador de Leads</h2>
        <p>Sistema de gerenciamento de leads da Arte Arena.</p>
      </Box>
    </PageContainer>
  );
}

export default LeadsScreen; 