import { Grid } from "@mui/material";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import CustomExSwitch from "@/app/components/forms/form-elements/switch/Custom";
import DefaultSwitch from "@/app/components/forms/form-elements/switch/Default";
import DefaultLabelSwitch from "@/app/components/forms/form-elements/switch/DefaultLabel";
import SizesSwitch from "@/app/components/forms/form-elements/switch/Sizes";
import ColorsSwitch from "@/app/components/forms/form-elements/switch/Colors";
import PositionSwitch from "@/app/components/forms/form-elements/switch/Position";

import CustomSwitchCode from "@/app/components/forms/form-elements/switch/code/CustomSwitchCode";
import DefaultSwitchCode from "@/app/components/forms/form-elements/switch/code/DefaultSwitchCode";
import DefaultLabelSwitchCode from "@/app/components/forms/form-elements/switch/code/DefaultLabelSwitchCode";
import SizesSwitchCode from "@/app/components/forms/form-elements/switch/code/SizesSwitchCode";
import ColorsSwitchCode from "@/app/components/forms/form-elements/switch/code/ColorsSwitchCode";
import PositionSwitchCode from "@/app/components/forms/form-elements/switch/code/PositionSwitchCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Switch",
  },
];

const MuiSwitch = () => (
  <PageContainer title="Switch" description="this is Switch">
    {/* breadcrumb */}
    <Breadcrumb title="Switch" items={BCrumb} />
    {/* end breadcrumb */}
    <ParentCard title="Switch">
      <Grid container spacing={3}>
        {/* ------------------------------------------------------------------- */}
        {/* Custom */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Custom" codeModel={<CustomSwitchCode />}>
            <CustomExSwitch />
          </ChildCard>
        </Grid>
        {/* ------------------------------------------------------------------- */}
        {/* Default */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Default" codeModel={<DefaultSwitchCode />}>
            <DefaultSwitch />
          </ChildCard>
        </Grid>
        {/* ------------------------------------------------------------------- */}
        {/* Default with label */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard
            title="Default with Label"
            codeModel={<DefaultLabelSwitchCode />}
          >
            <DefaultLabelSwitch />
          </ChildCard>
        </Grid>
        {/* ------------------------------------------------------------------- */}
        {/* Sizes */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Sizes" codeModel={<SizesSwitchCode />}>
            <SizesSwitch />
          </ChildCard>
        </Grid>
        {/* ------------------------------------------------------------------- */}
        {/* Default Colors */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Default Colors" codeModel={<ColorsSwitchCode />}>
            <ColorsSwitch />
          </ChildCard>
        </Grid>
        {/* ------------------------------------------------------------------- */}
        {/* Placement */}
        {/* ------------------------------------------------------------------- */}
        <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Placement" codeModel={<PositionSwitchCode />}>
            <PositionSwitch />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiSwitch;
