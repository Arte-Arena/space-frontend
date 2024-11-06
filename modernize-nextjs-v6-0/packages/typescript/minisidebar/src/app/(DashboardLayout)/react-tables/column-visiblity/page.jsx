import * as React from 'react';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import TableColumnVisibility from '@/app/components/react-table/TableColumnVisibility';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Column Visibility React Table',
    },
];


const ReactColumnVisibilityTable = () => {

    return (
        <PageContainer title="Column Visibility Table" description="this is Column Visibility Table">
            {/* breadcrumb */}
            <Breadcrumb title="Column Visibility Table" items={BCrumb} />
            {/* end breadcrumb */}
            <TableColumnVisibility />
        </PageContainer>
    );
};

export default ReactColumnVisibilityTable;
