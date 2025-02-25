import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { KanbanDataContextProvider } from "@/app/context/kanbancontext/index";
import KanbanBoard from "@/app/components/status-kanban/KanbanBoard"

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
