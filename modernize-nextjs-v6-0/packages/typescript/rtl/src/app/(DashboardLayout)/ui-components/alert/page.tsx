import React from "react";
import { Grid, Stack, Button, Alert, AlertTitle } from "@mui/material";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";
import AlertTransition from "@/app/components/ui-components/alert/AlertTransition";

import FilledCode from "@/app/components/ui-components/alert/code/FilledCode";
import OutlinedCode from "@/app/components/ui-components/alert/code/OutlinedCode";
import DescriptionCode from "@/app/components/ui-components/alert/code/DescriptionCode";
import ActionCode from "@/app/components/ui-components/alert/code/ActionCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Alert",
  },
];

const ExAlert = () => {
  return (
    <PageContainer title="Alert" description="this is Alert">
      {/* breadcrumb */}
      <Breadcrumb title="Alert" items={BCrumb} />
      {/* end breadcrumb */}
      {/* ------------------------- row 1 ------------------------- */}

      <ParentCard title="Alert">
        <Grid container spacing={3}>
          {/* --------------------------------------------------------------------------------- */}
          {/* Filled Alert */}
          {/* --------------------------------------------------------------------------------- */}
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Filled" codeModel={<FilledCode />}>
              <Stack spacing={1}>
                <Alert variant="filled" severity="error">
                  This is an error alert — check it out!
                </Alert>
                <Alert variant="filled" severity="warning">
                  This is a warning alert — check it out!
                </Alert>
                <Alert variant="filled" severity="info">
                  This is an info alert — check it out!
                </Alert>
                <Alert variant="filled" severity="success">
                  This is a success alert — check it out!
                </Alert>
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Outlined Alert */}
          {/* --------------------------------------------------------------------------------- */}
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Outlined" codeModel={<OutlinedCode />}>
              <Stack spacing={1}>
                <Alert variant="outlined" severity="error">
                  This is an error alert — check it out!
                </Alert>
                <Alert variant="outlined" severity="warning">
                  This is a warning alert — check it out!
                </Alert>
                <Alert variant="outlined" severity="info">
                  This is an info alert — check it out!
                </Alert>
                <Alert variant="outlined" severity="success">
                  This is a success alert — check it out!
                </Alert>
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Description Alert */}
          {/* --------------------------------------------------------------------------------- */}
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Description" codeModel={<DescriptionCode />}>
              <Stack spacing={1}>
                <Alert variant="filled" severity="error">
                  <AlertTitle>Error</AlertTitle>
                  This is an error alert — <strong>check it out!</strong>
                </Alert>
                <Alert variant="filled" severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  This is a warning alert — <strong>check it out!</strong>
                </Alert>
                <Alert variant="filled" severity="info">
                  <AlertTitle>Info</AlertTitle>
                  This is an info alert — <strong>check it out!</strong>
                </Alert>
                <Alert variant="filled" severity="success">
                  <AlertTitle>Success</AlertTitle>
                  This is a success alert — <strong>check it out!</strong>
                </Alert>
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Action Alert */}
          {/* --------------------------------------------------------------------------------- */}
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Action" codeModel={<ActionCode />}>
              <Stack spacing={1}>
                <Alert variant="filled" severity="warning">
                  This is a success alert — check it out!
                </Alert>
                <Alert
                  variant="filled"
                  severity="info"
                  action={
                    <Button color="inherit" size="small">
                      UNDO
                    </Button>
                  }
                >
                  This is a success alert — check it out!
                </Alert>
              </Stack>
            </ChildCard>
          </Grid>
          {/* --------------------------------------------------------------------------------- */}
          {/* Transition Alert */}
          {/* --------------------------------------------------------------------------------- */}
          <Grid item xs={12} display="flex" alignItems="stretch">
            <AlertTransition />
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ExAlert;
