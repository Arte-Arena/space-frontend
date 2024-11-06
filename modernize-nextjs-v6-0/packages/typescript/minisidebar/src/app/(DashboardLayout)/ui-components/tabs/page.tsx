import * as React from "react";
import { Grid } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import TabIconLabel from "@/app/components/ui-components/tab/TabIconLabel";
import TabIconBottom from "@/app/components/ui-components/tab/TabIconBottom";
import TabIconLeft from "@/app/components/ui-components/tab/TabIconLeft";
import TabIconRight from "@/app/components/ui-components/tab/TabIconRight";
import TabScrollable from "@/app/components/ui-components/tab/TabScrollable";
import TabVertical from "@/app/components/ui-components/tab/TabVertical";
import TabIcon from "@/app/components/ui-components/tab/TabIcon";
import TabText from "@/app/components/ui-components/tab/TabText";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tabs",
  },
];

const MuiTabs = () => {
  return (
    <PageContainer title="Tabs" description="this is Tabs">
      {/* breadcrumb */}
      <Breadcrumb title="Tabs" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Tabs">
        <Grid container spacing={3}>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Text */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabText />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Icon */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabIcon />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Icon with Label */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabIconLabel />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Icon Bottom */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabIconBottom />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Icon Left */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabIconLeft />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Icon Right */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabIconRight />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Scrollable  */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabScrollable />
          </Grid>
          {/* ---------------------------------------------------------------------------------- */}
          {/* Vertical */}
          {/* ---------------------------------------------------------------------------------- */}
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <TabVertical />
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};
export default MuiTabs;
