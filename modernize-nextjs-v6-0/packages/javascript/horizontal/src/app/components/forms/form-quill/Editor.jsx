'use client';
import React from 'react';

import ParentCard from '@/app/components/shared/ParentCard';
import QuillEdit from './QuillEdit';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Quill Editor',
    },
];

const Editor = () => {

    return (

        <ParentCard title="Quill Editor">
            <QuillEdit />
        </ParentCard>

    );
};

export default Editor;
