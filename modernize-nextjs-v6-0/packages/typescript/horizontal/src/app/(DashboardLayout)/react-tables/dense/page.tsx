import * as React from "react";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import TableDense from "@/app/components/react-table/TableDense";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Basic React Table",
  },
];

const ReactDenseTable = () => {
  return (
    <PageContainer title="Dense Table" description="This is Dense Table">
      <Breadcrumb title="Dense Table" items={BCrumb} />
      <TableDense />
    </PageContainer>
  );
};

export default ReactDenseTable;
