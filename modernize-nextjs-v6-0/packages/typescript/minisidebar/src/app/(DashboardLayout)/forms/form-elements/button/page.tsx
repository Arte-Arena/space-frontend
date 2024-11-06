import React from "react";
import { Grid } from "@mui/material";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import ChildCard from "@/app/components/shared/ChildCard";

import DefaultButtons from "@/app/components/forms/form-elements/button/DefaultButtons";
import ColorButtons from "@/app/components/forms/form-elements/button/ColorButtons";
import IconLoadingButtons from "@/app/components/forms/form-elements/button/IconLoadingButtons";
import SizeButton from "@/app/components/forms/form-elements/button/SizeButton";

import OutlinedIconButtons from "@/app/components/forms/form-elements/button/OutlinedIconButtons";
import OutlinedSizeButton from "@/app/components/forms/form-elements/button/OutlinedSizeButton";

import TextDefaultButtons from "@/app/components/forms/form-elements/button/TextDefaultButtons";
import TextColorButtons from "@/app/components/forms/form-elements/button/TextColorButtons";
import TextIconButtons from "@/app/components/forms/form-elements/button/TextIconButtons";
import TextSizeButton from "@/app/components/forms/form-elements/button/TextSizeButton";

import IconColorButtons from "@/app/components/forms/form-elements/button/IconColorButtons";
import IconSizeButtons from "@/app/components/forms/form-elements/button/IconSizeButtons";

import FabDefaultButton from "@/app/components/forms/form-elements/button/FabDefaultButton";
import FabColorButtons from "@/app/components/forms/form-elements/button/FabColorButtons";
import FabSizeButtons from "@/app/components/forms/form-elements/button/FabSizeButtons";

import DefaultButtonGroup from "@/app/components/forms/form-elements/button/DefaultButtonGroup";
import SizeButtonGroup from "@/app/components/forms/form-elements/button/SizeButtonGroup";
import VerticalButtonGroup from "@/app/components/forms/form-elements/button/VerticalButtonGroup";
import ColorButtonGroup from "@/app/components/forms/form-elements/button/ColorButtonGroup";
import TextButtonGroup from "@/app/components/forms/form-elements/button/TextButtonGroup";
import OutlinedColorButtons from "@/app/components/forms/form-elements/button/OutlinedColorButtons";

// codeModel
import DefaultCode from "@/app/components/forms/form-elements/button/code/DefaultCode";
import ColorsCode from "@/app/components/forms/form-elements/button/code/ColorsCode";
import LoadingButtonsCode from "@/app/components/forms/form-elements/button/code/LoadingButtonsCode";
import SizesCode from "@/app/components/forms/form-elements/button/code/SizesCode";
import OutlinedCode from "@/app/components/forms/form-elements/button/code/OutlinedCode";
import OutlinedIconCode from "@/app/components/forms/form-elements/button/code/OutlinedIconCode";
import OutlineSizeCode from "@/app/components/forms/form-elements/button/code/OutlineSizeCode";
import TextCode from "@/app/components/forms/form-elements/button/code/TextCode";
import TextColorCode from "@/app/components/forms/form-elements/button/code/TextColorCode";
import TextIconColor from "@/app/components/forms/form-elements/button/code/TextIconColor";
import TextSizesCode from "@/app/components/forms/form-elements/button/code/TextSizesCode";
import IconColorCode from "@/app/components/forms/form-elements/button/code/IconColorCode";
import IconSizesCode from "@/app/components/forms/form-elements/button/code/IconSizesCode";
import FABCode from "@/app/components/forms/form-elements/button/code/FABCode";
import FABColorCode from "@/app/components/forms/form-elements/button/code/FABColorCode";
import FABSizeCode from "@/app/components/forms/form-elements/button/code/FABSizeCode";
import DefaultButtonGroupCode from "@/app/components/forms/form-elements/button/code/DefaultButtonGroupCode";
import SizeButtonGroupCode from "@/app/components/forms/form-elements/button/code/SizeButtonGroupCode";
import VerticalButtonGroupCode from "@/app/components/forms/form-elements/button/code/VerticalButtonGroupCode";
import TextButtonGroupCode from "@/app/components/forms/form-elements/button/code/TextButtonGroupCode";
import ColorButtonGroupCode from "@/app/components/forms/form-elements/button/code/ColorButtonGroupCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button",
  },
];

const MuiButton = () => (
  <PageContainer title="Button" description="this is Button">
    {/* breadcrumb */}
    <Breadcrumb title="Button" items={BCrumb} />
    {/* end breadcrumb */}
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ParentCard title="Buttons">
          <Grid container spacing={3}>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Default" codeModel={<DefaultCode />}>
                <DefaultButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Colors" codeModel={<ColorsCode />}>
                <ColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard
                title="Loading Buttons"
                codeModel={<LoadingButtonsCode />}
              >
                <IconLoadingButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Sizes" codeModel={<SizesCode />}>
                <SizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outlined" codeModel={<OutlinedCode />}>
                <OutlinedColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outlined Icon" codeModel={<OutlinedIconCode />}>
                <OutlinedIconButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outline Size" codeModel={<OutlineSizeCode />}>
                <OutlinedSizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text" codeModel={<TextCode />}>
                <TextDefaultButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Color" codeModel={<TextColorCode />}>
                <TextColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Icon" codeModel={<TextIconColor />}>
                <TextIconButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Sizes" codeModel={<TextSizesCode />}>
                <TextSizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Icon Color" codeModel={<IconColorCode />}>
                <IconColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Icon Sizes" codeModel={<IconSizesCode />}>
                <IconSizeButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB" codeModel={<FABCode />}>
                <FabDefaultButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB Color" codeModel={<FABColorCode />}>
                <FabColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB Size" codeModel={<FABSizeCode />}>
                <FabSizeButtons />
              </ChildCard>
            </Grid>
          </Grid>
        </ParentCard>
      </Grid>
      <Grid item xs={12}>
        <ParentCard title="Button Group">
          <Grid container spacing={3}>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Default" codeModel={<DefaultButtonGroupCode />}>
                <DefaultButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Sizes" codeModel={<SizeButtonGroupCode />}>
                <SizeButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard
                title="Verical"
                codeModel={<VerticalButtonGroupCode />}
              >
                <VerticalButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text" codeModel={<TextButtonGroupCode />}>
                <TextButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} display="flex" alignItems="stretch">
              <ChildCard title="Color" codeModel={<ColorButtonGroupCode />}>
                <ColorButtonGroup />
              </ChildCard>
            </Grid>
          </Grid>
        </ParentCard>
      </Grid>
    </Grid>
  </PageContainer>
);
export default MuiButton;
