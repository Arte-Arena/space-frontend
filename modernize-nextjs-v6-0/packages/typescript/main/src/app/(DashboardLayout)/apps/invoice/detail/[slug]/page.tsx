import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import InvoiceDetail from "@/app/components/apps/invoice/Invoice-detail/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Invoice Details",
  },
];

const InvoiceDetailPage = () => {
  return (
    <InvoiceProvider>
      <PageContainer
        title="Invoice Detail"
        description="this is Invoice Detail"
      >
        <Breadcrumb title="Invoice Detail" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <InvoiceDetail />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </InvoiceProvider>
  );
};
export default InvoiceDetailPage;
