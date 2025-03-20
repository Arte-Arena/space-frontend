import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import TaskManager from "@/app/components/apps/kanban/TaskManager";
import { KanbanDataContextProvider } from "@/app/context/kanbancontext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import KanbanBoard from "@/app/components/status-kanban/KanbanBoard";

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
    title: "Funil",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Funil de Vendas" description="este é o funil de vendas da Arte Arena">
        <Breadcrumb title="Funil de Vendas" items={BCrumb} />
        <KanbanBoard>
          
        </KanbanBoard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
