import * as React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import TableExpanding from '@/app/components/react-table/TableExpanding';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Basic React Table',
    },
];


const ExpandingTable = () => {


    return (
        <PageContainer title="Expand Table" description="this is Expand Table">
            {/* breadcrumb */}
            <Breadcrumb title="Expand Table" items={BCrumb} />
            {/* end breadcrumb */}
            <TableExpanding />
        </PageContainer >
    );
};
export default ExpandingTable;
