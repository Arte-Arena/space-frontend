import * as React from "react";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import ExTablePagination from "@/app/components/tables/ExTablePagination";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pagination Table",
  },
];

const PaginationTable = () => {
  return (
    <PageContainer
      title="Pagination Table"
      description="this is Pagination Table"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Pagination Table" items={BCrumb} />
      {/* end breadcrumb */}
      <ExTablePagination />
    </PageContainer>
  );
};

export default PaginationTable;
