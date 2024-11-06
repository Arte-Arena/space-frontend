import * as React from "react";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import TableEmpty from "@/app/components/react-table/TableEmpty";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Empty React Table",
  },
];

const EmptyTable = () => {
  return (
    <PageContainer title="Empty Table" description="this is Empty Table">
      {/* breadcrumb */}
      <Breadcrumb title="Empty Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableEmpty />
    </PageContainer>
  );
};

export default EmptyTable;
