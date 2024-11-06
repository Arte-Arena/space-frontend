'use client';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import './Quill.css';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ ...props }) => <RQ {...props} />;
    },
    {
        ssr: false,
    },
);

import Paper from '@mui/material/Paper';


const QuillEdit = () => {
    const [text, setText] = useState('');

    const theme = useTheme();
    const borderColor = theme.palette.divider;

    return (


        <Paper sx={{ border: `1px solid ${borderColor}` }} variant="outlined">
            <ReactQuill
                value={text}
                onChange={(value) => {
                    setText(value);
                }}
                placeholder="Type here..."
            />
        </Paper>

    );
};

export default QuillEdit;
