'use client'
import React, { useEffect } from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import TaskManager from "@/app/components/apps/kanban/TaskManager";
import { KanbanDataContextProvider } from "@/app/context/kanbancontext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
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
    title: "Funil",
  },
];

  const isLoggedIn = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Funil de Vendas" description="este é o funil de vendas da Arte Arena">
        <Breadcrumb title="Funil de Vendas" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <TaskManager />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
