'use client';
import * as React from 'react';
import { Rating } from '@mui/material';

import ChildCard from '@/app/components/shared/ChildCard';

const Disabled = () => {
    const [value, setValue] = React.useState(2);

    return (

        <ChildCard title="Disabled">
            <Rating name="disabled" value={value} disabled />
        </ChildCard>

    );
};
export default Disabled;
