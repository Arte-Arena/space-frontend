import * as React from 'react';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

import TablePagination from '@/app/components/react-table/TablePagination';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Filter React Table',
    },
];


const ReactPaginationTable = () => {


    return (
        <PageContainer title="Pagination Table" description="this is Pagination Table">
            {/* breadcrumb */}
            <Breadcrumb title="Pagination Table" items={BCrumb} />
            {/* end breadcrumb */}
            <TablePagination />
        </PageContainer>
    );
};

export default ReactPaginationTable;
