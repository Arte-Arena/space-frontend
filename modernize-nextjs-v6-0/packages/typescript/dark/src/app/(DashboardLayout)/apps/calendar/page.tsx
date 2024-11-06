import PageContainer from "@/app/components/container/PageContainer";
import Calendar from "@/app/components/apps/calendar/index";
import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

const page = () => {
  return (
    <>
      <PageContainer title="Calendar" description="this is Calendar">
        <Breadcrumb title="Calendar" subtitle="App" />
        <Calendar />
      </PageContainer>
    </>
  );
};

export default page;
