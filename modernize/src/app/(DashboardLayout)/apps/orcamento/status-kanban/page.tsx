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
    title: "Kanban",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Kanban App" description="this is Kanban App">
        <Breadcrumb title="Kanban app" items={BCrumb} />
            <KanbanBoard>
            </KanbanBoard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
