
import * as React from "react";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import TableBasicReact from "@/app/components/react-table/TableBasicReact";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Basic React Table",
  },
];

const ReactBasicTable = () => {
  return (
    <PageContainer title="Basic Table" description="this is Basic Table">
      {/* breadcrumb */}
      <Breadcrumb title="Basic Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableBasicReact />
    </PageContainer>
  );
};

export default ReactBasicTable;
