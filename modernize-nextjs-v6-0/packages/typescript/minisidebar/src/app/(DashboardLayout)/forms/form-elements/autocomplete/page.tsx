import { Grid } from "@mui/material";

import ComboBoxAutocomplete from "@/app/components/forms/form-elements/autoComplete/ComboBoxAutocomplete";
import CountrySelectAutocomplete from "@/app/components/forms/form-elements/autoComplete/CountrySelectAutocomplete";
import ControlledStateAutocomplete from "@/app/components/forms/form-elements/autoComplete/ControlledStateAutocomplete";
import FreeSoloAutocomplete from "@/app/components/forms/form-elements/autoComplete/FreeSoloAutocomplete";
import MultipleValuesAutocomplete from "@/app/components/forms/form-elements/autoComplete/MultipleValuesAutocomplete";
import CheckboxesAutocomplete from "@/app/components/forms/form-elements/autoComplete/CheckboxesAutocomplete";
import SizesAutocomplete from "@/app/components/forms/form-elements/autoComplete/SizesAutocomplete";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";

// codeModel
import ComboBoxCode from "@/app/components/forms/form-elements/autoComplete/code/ComboBoxCode";
import CountrySelectCode from "@/app/components/forms/form-elements/autoComplete/code/CountrySelectCode";
import ControlledStateCode from "@/app/components/forms/form-elements/autoComplete/code/ControlledStateCode";
import FreeSoloCode from "@/app/components/forms/form-elements/autoComplete/code/FreeSoloCode";
import MultipleValuesCode from "@/app/components/forms/form-elements/autoComplete/code/MultipleValuesCode";
import CheckboxesCode from "@/app/components/forms/form-elements/autoComplete/code/CheckboxesCode";
import SizesCode from "@/app/components/forms/form-elements/autoComplete/code/SizesCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "AutoComplete",
  },
];

const MuiAutoComplete = () => (
  <PageContainer title="Autocomplete" description="this is Autocomplete">
    {/* breadcrumb */}
    <Breadcrumb title="AutoComplete" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="Autocomplete">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Combo Box" codeModel={<ComboBoxCode />}>
            <ComboBoxAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Country Select" codeModel={<CountrySelectCode />}>
            <CountrySelectAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard
            title="Controlled State"
            codeModel={<ControlledStateCode />}
          >
            <ControlledStateAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Free Solo" codeModel={<FreeSoloCode />}>
            <FreeSoloAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Multiple Values" codeModel={<MultipleValuesCode />}>
            <MultipleValuesAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Checkboxes" codeModel={<CheckboxesCode />}>
            <CheckboxesAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Sizes" codeModel={<SizesCode />}>
            <SizesAutocomplete />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiAutoComplete;
