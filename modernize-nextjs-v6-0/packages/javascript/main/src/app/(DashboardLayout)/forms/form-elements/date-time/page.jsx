
import React from 'react';
import { Grid } from '@mui/material';
import ParentCard from '@/app/components/shared/ParentCard';
import ChildCard from '@/app/components/shared/ChildCard';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
// codeModel
import BasicDateTimeCode from '@/app/components/forms/form-elements/date-time/code/BasicDateTimeCode';
import DifferentDesignCode from '@/app/components/forms/form-elements/date-time/code/DifferentDesignCode';
import TimepickerCode from '@/app/components/forms/form-elements/date-time/code/TimepickerCode';
import BasicDateTime from '@/app/components/forms/form-elements/date-time/BasicDateTime';
import DiffrentDesignDt from '@/app/components/forms/form-elements/date-time/DiffrentDesignDt';
import TimePickerDt from '@/app/components/forms/form-elements/date-time/TimePicker';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Date Time',
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
            <ChildCard title="Basic" codeModel={<BasicDateTimeCode />}>
              <BasicDateTime />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Different */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Different Design" codeModel={<DifferentDesignCode />}>
              <DiffrentDesignDt />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Timepicker */}
          {/* ------------------------------------------------------------------- */}
          <Grid item xs={12} lg={6} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Timepicker" codeModel={<TimepickerCode />}>
              <TimePickerDt />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default MuiDateTime;
