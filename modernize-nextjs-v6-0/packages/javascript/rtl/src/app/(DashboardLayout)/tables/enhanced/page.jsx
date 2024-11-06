
import React from 'react';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

import TableEnhanced from '@/app/components/tables/TableEnhanced';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Enhanced Table',
  },
];

const EnhanceTable = () => {

  return (
    <PageContainer title="Enhanced Table" description="this is Enhanced Table">
      {/* breadcrumb */}
      <Breadcrumb title="Enhanced Table" items={BCrumb} />
      <TableEnhanced />
    </PageContainer>
  );
};

export default EnhanceTable;
