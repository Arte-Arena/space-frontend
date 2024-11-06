import * as React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

import TableCollapsible from '@/app/components/tables/TableCollapsible';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Collapsible Table',
  },
];


const CollapsibleTable = () => (
  <PageContainer title="Collapsible Table" description="this is Collapsible Table">
    {/* breadcrumb */}
    <Breadcrumb title="Collapsible Table" items={BCrumb} />
    {/* end breadcrumb */}
    <TableCollapsible />
  </PageContainer>
);

export default CollapsibleTable;
