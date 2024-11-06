import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const OutlinedCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client";
import * as React from 'react';
import { 
Avatar, 
Chip, 
Grid }  from '@mui/material';
import { 
IconCheck, 
IconChecks, 
IconMoodHappy } from '@tabler/icons-react';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Filled" />
    <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />} label="Default Filled" color="primary" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />} label="Default Deletable" color="primary" onDelete={handleDelete} />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="secondary" />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="secondary" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Filled" color="success" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Deletable" color="success" onDelete={handleDelete} />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="warning" />
    <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Filled" color="error" />
    <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Deletable" color="error" onDelete={handleDelete} />
</InlineItemCard>`}
            </CodeDialog>
        </>
    );
};

export default OutlinedCode;