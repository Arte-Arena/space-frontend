import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Slider } from '@mui/material';
import Typography from '@mui/material/Typography';
import ParentCard from '@/app/components/shared/ParentCard';
import ChildCard from '@/app/components/shared/ChildCard';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomSlider from '@/app/components/forms/theme-elements/CustomSlider';
import { IconVolume, IconVolume2 } from '@tabler/icons-react';

// codeModel
import CustomSliderCode from '@/app/components/forms/form-elements/slider/code/CustomSliderCode';
import VolumesliderCode from '@/app/components/forms/form-elements/slider/code/VolumesliderCode';
import RangesliderCode from '@/app/components/forms/form-elements/slider/code/RangesliderCode';
import DefaultsliderCode from '@/app/components/forms/form-elements/slider/code/DefaultsliderCode';
import DisabledSliderCode from '@/app/components/forms/form-elements/slider/code/DisabledSliderCode';
import DiscreteSliderCode from '@/app/components/forms/form-elements/slider/code/DiscreteSliderCode';
import TemperatureRangeCode from '@/app/components/forms/form-elements/slider/code/TemperatureRangeCode';
import RangeDefault from '@/app/components/forms/form-elements/slider/RangeDefault';
import DiscreteSlider from '@/app/components/forms/form-elements/slider/DiscreteSlider';
import VolumeSlider from '@/app/components/forms/form-elements/slider/VolumeSlider';
import RangeSlider from '@/app/components/forms/form-elements/slider/RangeSlider';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Slider',
  },
];

const MuiSlider = () => {

  return (
    <PageContainer title="Slider" description="this is Slider">
      {/* breadcrumb */}
      <Breadcrumb title="Slider" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Slider">
        <Grid container spacing={3}>
          {/* ------------------------------------------------------------------- */}
          {/* Custom */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Custom" codeModel={<CustomSliderCode />}>
              <CustomSlider defaultValue={[30]} />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Volume */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Volume" codeModel={<VolumesliderCode />}>
              <CustomSlider defaultValue={30} aria-label="volume slider" />
              <Box display="flex" alignItems="center">
                <Typography>
                  <IconVolume2 width={20} />
                </Typography>
                <Box ml="auto">
                  <Typography>
                    <IconVolume width={20} />
                  </Typography>
                </Box>
              </Box>
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Range */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Range" codeModel={<RangesliderCode />}>
              <RangeSlider />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Default" codeModel={<DefaultsliderCode />}>
              <Slider defaultValue={30} />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Disabled */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Disabled" codeModel={<DisabledSliderCode />}>
              <Slider disabled defaultValue={30} />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Volume */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Volume">
              <VolumeSlider />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Discrete */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Discrete" codeModel={<DiscreteSliderCode />}>
              <DiscreteSlider />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Range Default */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Range Default" codeModel={<TemperatureRangeCode />}>
              <RangeDefault />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default MuiSlider;
