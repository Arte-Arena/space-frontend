import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import React from "react";
import ApexArea from "@/app/components/charts/ApexArea";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Area Chart",
  },
];

const AreaChart = () => {
  return (
    <PageContainer title="Area Chart" description="this is Area Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Area Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexArea />
    </PageContainer>
  );
};

export default AreaChart;
