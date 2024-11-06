import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexRadar from "@/app/components/charts/ApexRadar";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radialbar Chart",
  },
];

const RadialbarChart = () => {
  return (
    <PageContainer
      title="Radialbar Chart"
      description="this is Radialbar Chart"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Radialbar Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexRadar />
    </PageContainer>
  );
};

export default RadialbarChart;
