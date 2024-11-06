import { Grid } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";

import SimpleList from "@/app/components/ui-components/lists/SimpleList";
import NestedList from "@/app/components/ui-components/lists/NestedList";
import FolderList from "@/app/components/ui-components/lists/FolderList";
import SelectedList from "@/app/components/ui-components/lists/SelectedList";
import ControlsList from "@/app/components/ui-components/lists/ControlsList";
import SwitchList from "@/app/components/ui-components/lists/SwitchList";
import React from "react";

import SimpleListCode from "@/app/components/ui-components/lists/code/SimpleListCode";
import NestedListCode from "@/app/components/ui-components/lists/code/NestedListCode";
import FolderListCode from "@/app/components/ui-components/lists/code/FolderListCode";
import SelectedListCode from "@/app/components/ui-components/lists/code/SelectedListCode";
import ControlsListCode from "@/app/components/ui-components/lists/code/ControlsListCode";
import SwitchListCode from "@/app/components/ui-components/lists/code/SwitchListCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "List",
  },
];

const MuiList = () => (
  <PageContainer title="List" description="this is List">
    {/* breadcrumb */}
    <Breadcrumb title="List" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="List">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Simple" codeModel={<SimpleListCode />}>
            <SimpleList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Nested" codeModel={<NestedListCode />}>
            <NestedList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Folder" codeModel={<FolderListCode />}>
            <FolderList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Selected" codeModel={<SelectedListCode />}>
            <SelectedList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Controls" codeModel={<ControlsListCode />}>
            <ControlsList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Switch" codeModel={<SwitchListCode />}>
            <SwitchList />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiList;
