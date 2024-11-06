import * as React from "react";
import { Grid } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import Basic from "@/app/components/ui-components/accordion/Basic";
import Controlled from "@/app/components/ui-components/accordion/Controlled";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Accordion",
  },
];

const MuiAccordion = () => {
  return (
    <PageContainer title="Accordian" description="this is Accordian">
      {/* breadcrumb */}
      <Breadcrumb title="Accordion" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Accordion">
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" alignItems="stretch">
            <Basic />
          </Grid>
          <Grid item xs={12} display="flex" alignItems="stretch">
            <Controlled />
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};
export default MuiAccordion;
