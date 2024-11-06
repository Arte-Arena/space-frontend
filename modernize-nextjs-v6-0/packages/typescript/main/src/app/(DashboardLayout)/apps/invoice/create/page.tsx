import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React from "react";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { InvoiceProvider } from "@/app/context/InvoiceContext";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Invoice Create",
  },
];

const CreateInvoice = () => {
  return (
    <InvoiceProvider>
      <PageContainer
        title="Create Invoice"
        description="this is Create Invoice"
      >
        <Breadcrumb title="Create Invoice" items={BCrumb} />

        <BlankCard>
          <CardContent>
            <CreateInvoiceApp />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </InvoiceProvider>
  );
};
export default CreateInvoice;
