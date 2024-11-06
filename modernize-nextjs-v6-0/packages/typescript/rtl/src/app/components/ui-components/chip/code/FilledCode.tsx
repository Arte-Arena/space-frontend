import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const FilledCode = () => {
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
    <Chip avatar={<Avatar>M</Avatar>} label="Default Filled" />
    <Chip avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />} label="Primary Filled" color="primary" />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />} label="Primary Deletable" color="primary" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Secondary Filled" color="secondary" />
    <Chip icon={<IconMoodHappy />} label="Secondary Deletable" color="secondary" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Filled" color="success" />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Deletable" color="success" onDelete={handleDelete} />
    <Chip icon={<IconMoodHappy />} label="Default Filled" color="warning" />
    <Chip icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Filled" color="error" />
    <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Deletable" color="error" onDelete={handleDelete} />
</InlineItemCard>`}
            </CodeDialog>
        </>
    );
};

export default FilledCode;