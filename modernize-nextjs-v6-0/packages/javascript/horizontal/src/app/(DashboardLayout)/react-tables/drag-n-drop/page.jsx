import * as React from 'react';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import TableRowDragDrop from '@/app/components/react-table/TableRowDragDrop';
import TableColumnDragDrop from '@/app/components/react-table/TableColumnDragDrop';
import { Grid } from '@mui/material';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Drag & drop Table',
    },
];

const DragnDropTable = () => {


    return (
        <PageContainer title="Drag & drop Table" description="this is Drag & drop Table">
            {/* breadcrumb */}
            <Breadcrumb title="Drag & drop Table" items={BCrumb} />
            {/* end breadcrumb */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableRowDragDrop />
                </Grid>
                <Grid item xs={12}>
                    <TableColumnDragDrop />
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default DragnDropTable;
