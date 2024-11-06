import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import React from "react";
import ApexCandlestick from "@/app/components/charts/ApexCandlestick";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Candlestick Chart",
  },
];

const CandlestickChart = () => {
  return (
    <PageContainer
      title="Candlestick Chart"
      description="this is Candlestick Chart"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Candlestick Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexCandlestick />
    </PageContainer>
  );
};

export default CandlestickChart;
