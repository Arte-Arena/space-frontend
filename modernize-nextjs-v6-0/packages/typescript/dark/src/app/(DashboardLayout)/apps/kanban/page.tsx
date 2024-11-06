import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import TaskManager from "@/app/components/apps/kanban/TaskManager";
import { KanbanDataContextProvider } from "@/app/context/kanbancontext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Kanban",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Kanban App" description="this is Kanban App">
        <Breadcrumb title="Kanban app" items={BCrumb} />
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
