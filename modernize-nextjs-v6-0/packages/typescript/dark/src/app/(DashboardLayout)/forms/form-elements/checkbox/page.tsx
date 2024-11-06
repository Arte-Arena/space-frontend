import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";

import { Grid } from "@mui/material";

// custom components
import PositionCheckbox from "@/app/components/forms/form-elements/checkbox/Position";
import SizesCheckbox from "@/app/components/forms/form-elements/checkbox/Sizes";
import DefaultcolorsCheckbox from "@/app/components/forms/form-elements/checkbox/DefaultColors";
import CustomEleCheckbox from "@/app/components/forms/form-elements/checkbox/Custom";
import DefaultCheckbox from "@/app/components/forms/form-elements/checkbox/Default";
import ColorsCheckbox from "@/app/components/forms/form-elements/checkbox/Colors";

// codeModel
import CustomEleCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/CustomEleCheckboxCode";
import ColorsCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/ColorsCheckboxCode";
import DefaultCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/DefaultCheckboxCode";
import DefaultcolorsCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/DefaultcolorsCheckboxCode";
import SizesCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/SizesCheckboxCode";
import PositionCheckboxCode from "@/app/components/forms/form-elements/checkbox/code/PositionCheckboxCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Checkbox",
  },
];

const MuiCheckbox = () => {
  return (
    <PageContainer title="Checkbox" description="this is Checkbox">
      {/* breadcrumb */}
      <Breadcrumb title="Checkbox" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Checkbox">
        <Grid container spacing={3}>
          {/* ------------------------------------------------------------------- */}
          {/* Custom  */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Custom" codeModel={<CustomEleCheckboxCode />}>
              <CustomEleCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Colors  */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Colors" codeModel={<ColorsCheckboxCode />}>
              <ColorsCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default Checkbox */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Default" codeModel={<DefaultCheckboxCode />}>
              <DefaultCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default with colors */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard
              title="Default with Colors"
              codeModel={<DefaultcolorsCheckboxCode />}
            >
              <DefaultcolorsCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Sizes */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard
              title="Sizes & Custom Icon"
              codeModel={<SizesCheckboxCode />}
            >
              <SizesCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Position */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Position" codeModel={<PositionCheckboxCode />}>
              <PositionCheckbox />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default MuiCheckbox;
