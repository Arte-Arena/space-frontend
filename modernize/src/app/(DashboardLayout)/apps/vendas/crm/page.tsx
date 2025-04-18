'use client'
import React, { useEffect } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { KanbanDataContextProvider } from "@/app/context/kanbancontext/index";
import KanbanBoard from "@/app/components/status-kanban/KanbanBoard"
import { useAuth } from "@/utils/useAuth";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Vendas",
  },
  {
    to: "/apps/vendas/crm",
    title: "CRM",
  },
];



function VendasCrmScreen() {
  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);
  return (
    <KanbanDataContextProvider>
      <PageContainer title="CRM" description="CRM da Arte Arena">
        <Breadcrumb title="CRM" items={BCrumb} />
            <KanbanBoard>
            </KanbanBoard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default VendasCrmScreen;
