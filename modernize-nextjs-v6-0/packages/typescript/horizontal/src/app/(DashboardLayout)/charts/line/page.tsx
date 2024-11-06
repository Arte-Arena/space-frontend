import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexLine from "@/app/components/charts/ApexLine";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Line Chart",
  },
];

const LineChart = () => {
  return (
    <PageContainer title="Line Chart" description="this is Line Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Line Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexLine />
    </PageContainer>
  );
};

export default LineChart;
