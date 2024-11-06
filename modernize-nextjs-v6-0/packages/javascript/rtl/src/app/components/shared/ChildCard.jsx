'use client'
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';

const ChildCard = ({ title, children, codeModel }) => (
  <Card sx={{ padding: 0, borderColor: (theme) => theme.palette.divider }} variant="outlined">
    {title ? (
      <>
        <CardHeader title={title} action={codeModel}/>
        <Divider />{' '}
      </>
    ) : (
      ''
    )}

    <CardContent>{children}</CardContent>
  </Card>
);

ChildCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node, 
  codeModel: PropTypes.node,
};

export default ChildCard;
