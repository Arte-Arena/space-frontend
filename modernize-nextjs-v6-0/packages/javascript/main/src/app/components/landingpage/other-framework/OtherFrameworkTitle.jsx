'use client';
import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const OtherFrameworkTitle = () => {

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={10} lg={8}>
                <Typography variant='h2' fontWeight={700} textAlign="center" sx={{
                    fontSize: {
                        lg: '36px',
                        xs: '25px'
                    },
                    lineHeight: {
                        lg: '43px',
                        xs: '30px'
                    }
                }}>Technology Offerings</Typography>
                <Typography variant="body1"  textAlign="center" mt={4}>Modernize across a variety of technologies. Simply select to drive in and find the ideal solution tailored to your requirements. <Typography component="span" color="primary.main">Note that each option is sold seprately.</Typography></Typography>
            </Grid>
        </Grid>
    );
};

export default OtherFrameworkTitle;
