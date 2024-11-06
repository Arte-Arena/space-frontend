import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import TableEnhance from "@/app/components/tables/TableEnhance";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Enhanced Table",
  },
];

const EnhanceTable = () => {
  return (
    <PageContainer title="Enhanced Table" description="this is Enhanced Table">
      {/* breadcrumb */}
      <Breadcrumb title="Enhanced Table" items={BCrumb} />
      <TableEnhance />
    </PageContainer>
  );
};

export default EnhanceTable;
