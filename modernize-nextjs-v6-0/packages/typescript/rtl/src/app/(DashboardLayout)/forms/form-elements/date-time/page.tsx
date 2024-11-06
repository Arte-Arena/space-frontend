import React from "react";
import { Grid } from "@mui/material";
import ParentCard from "@/app/components/shared/ParentCard";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

import BasicDateTime from "@/app/components/forms/form-elements/date-time/BasicDateTime";
import DifferentDateTime from "@/app/components/forms/form-elements/date-time/DifferentDateTime";
import MuiDateTimePicker from "@/app/components/forms/form-elements/date-time/MuiDateTimePicker";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Date Time",
  },
];

const MuiDateTime = () => {
  return (
    <PageContainer title="Datepicker" description="this is Datepicker">
      {/* breadcrumb */}
      <Breadcrumb title="Date Picker" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Date Time">
        <Grid container spacing={3}>
          {/* ------------------------------------------------------------------- */}
          {/* Basic */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <BasicDateTime />
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Different */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <DifferentDateTime />
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Timepicker */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <MuiDateTimePicker />
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default MuiDateTime;
