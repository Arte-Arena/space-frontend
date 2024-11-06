import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexGradient from "@/app/components/charts/ApexGradient";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Gradient Chart",
  },
];

const Gradient = () => {
  return (
    <PageContainer title="Gradient Chart" description="this is Gradient Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Gradient Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexGradient />
    </PageContainer>
  );
};

export default Gradient;
