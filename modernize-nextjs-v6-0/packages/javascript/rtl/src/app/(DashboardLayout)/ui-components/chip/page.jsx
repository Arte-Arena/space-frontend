import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import ChipCommon from '@/app/components/ui-components/chip/ChipCommon';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Chip',
  },
];

const MuiChip = () => {

  return (
    <PageContainer title="Chip" description="this is Chip">
      {/* breadcrumb */}
      <Breadcrumb title="Chip" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Chip">
        <ChipCommon />
      </ParentCard>
    </PageContainer>
  );
}
export default MuiChip;
