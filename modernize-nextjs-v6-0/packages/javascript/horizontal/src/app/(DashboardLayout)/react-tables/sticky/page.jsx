import * as React from 'react';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

import TableSticky from '@/app/components/react-table/TableSticky';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Sticky React Table',
    },
];

const StickyTable = () => {


    return (
        <PageContainer title="Sticky Table" description="this is Sticky Table">
            {/* breadcrumb */}
            <Breadcrumb title="Sticky Table" items={BCrumb} />
            {/* end breadcrumb */}
            <TableSticky />
        </PageContainer>
    );
};

export default StickyTable;
