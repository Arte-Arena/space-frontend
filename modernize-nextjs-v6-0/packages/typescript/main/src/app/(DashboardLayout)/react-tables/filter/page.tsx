import * as React from "react";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import TableFilter from "@/app/components/react-table/TableFilter";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Filter React Table",
  },
];

const ReactFilterTable = () => {
  return (
    <PageContainer title="Filter Table" description="this is Filter Table">
      {/* breadcrumb */}
      <Breadcrumb title="Filter Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableFilter />
    </PageContainer>
  );
};

export default ReactFilterTable;
