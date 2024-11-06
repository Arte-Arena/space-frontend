import { Grid } from "@mui/material";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ColorLabelRadio from "@/app/components/forms/form-elements/radio/ColorLabel";
import DefaultRadio from "@/app/components/forms/form-elements/radio/Default";
import ColorsRadio from "@/app/components/forms/form-elements/radio/Colors";
import SizesRadio from "@/app/components/forms/form-elements/radio/Sizes";
import CustomExRadio from "@/app/components/forms/form-elements/radio/Custom";
import PositionRadio from "@/app/components/forms/form-elements/radio/Position";

// codeModel
import CustomExRadioCode from "@/app/components/forms/form-elements/radio/code/CustomExRadioCode";
import ColorLabelRadioCode from "@/app/components/forms/form-elements/radio/code/ColorLabelRadioCode";
import DefaultRadioCode from "@/app/components/forms/form-elements/radio/code/DefaultRadioCode";
import ColorsRadioCode from "@/app/components/forms/form-elements/radio/code/ColorsRadioCode";
import SizesRadioCode from "@/app/components/forms/form-elements/radio/code/SizesRadioCode";
import PositionRadioCode from "@/app/components/forms/form-elements/radio/code/PositionRadioCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radio",
  },
];

const ExRadio = () => {
  return (
    <PageContainer title="Radio" description="this is Radio">
      {/* breadcrumb */}
      <Breadcrumb title="Radio" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Radio">
        <Grid container spacing={3}>
          {/* ------------------------------------------------------------------- */}
          {/* Custom */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Custom" codeModel={<CustomExRadioCode />}>
              <CustomExRadio />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Color with label */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard
              title="Color with Label"
              codeModel={<ColorLabelRadioCode />}
            >
              <ColorLabelRadio />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Default" codeModel={<DefaultRadioCode />}>
              <DefaultRadio />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default Colors */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Default Colors" codeModel={<ColorsRadioCode />}>
              <ColorsRadio />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Sizes */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Sizes" codeModel={<SizesRadioCode />}>
              <SizesRadio />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Position */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Position" codeModel={<PositionRadioCode />}>
              <PositionRadio />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ExRadio;
