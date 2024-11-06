import { Grid, Typography } from "@mui/material";

// components
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import BasicLayout from "@/app/components/forms/form-horizontal/BasicLayout";
import BasicIcons from "@/app/components/forms/form-horizontal/BasicIcons";
import FormSeparator from "@/app/components/forms/form-horizontal/FormSeparator";
import FormLabelAlignment from "@/app/components/forms/form-horizontal/FormLabelAlignment";
import CollapsibleForm from "@/app/components/forms/form-horizontal/CollapsibleForm";
import FormTabs from "@/app/components/forms/form-horizontal/FormTabs";

import BasicLayoutCode from "@/app/components/forms/form-horizontal/code/BasicLayoutCode";
import BasicIconsCode from "@/app/components/forms/form-horizontal/code/BasicIconsCode";
import FormSeparatorCode from "@/app/components/forms/form-horizontal/code/FormSeparatorCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Horizontal Form",
  },
];

const FormHorizontal = () => {
  return (
    <PageContainer
      title="Horizontal Form"
      description="this is Horizontal Form"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Horizontal Form" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard title="Basic Layout" codeModel={<BasicLayoutCode />}>
            <BasicLayout />
          </ParentCard>
        </Grid>
        <Grid item xs={12}>
          <ParentCard title="Basic with Icons" codeModel={<BasicIconsCode />}>
            <BasicIcons />
          </ParentCard>
        </Grid>
        <Grid item xs={12}>
          <ParentCard title="Form Separator" codeModel={<FormSeparatorCode />}>
            <FormSeparator />
          </ParentCard>
        </Grid>
        <Grid item xs={12}>
          <ParentCard title="Form Label Alignment">
            <FormLabelAlignment />
          </ParentCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" mb={3}>
            Collapsible Section
          </Typography>
          <CollapsibleForm />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" mb={3}>
            Form with Tabs
          </Typography>
          <FormTabs />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FormHorizontal;
