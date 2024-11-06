'use client';
import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import Image from 'next/image';
import ContentArea from './ContentArea';
import ReviewCarousel from './ReviewCarousel';

const Reviews = () => {
  return (
    <>
      <Box
        sx={{
          py: {
            xs: 5,
            lg: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} lg={5} sm={8} pr={6}>
              <ContentArea />
            </Grid>
            <Grid item xs={12} lg={6} sm={12}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} lg={10}>
                  <ReviewCarousel />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Reviews;
