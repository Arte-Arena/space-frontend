import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexDonut from "@/app/components/charts/ApexDonut";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Doughtnut Chart",
  },
];

const DoughnutChart = () => {
  return (
    <PageContainer title="Doughnut Chart" description="this is Doughnut Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Doughtnut Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexDonut />
    </PageContainer>
  );
};

export default DoughnutChart;
