'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import BannerContent from './BannerContent';
import Image from 'next/image';

import bannerImg1 from "/public/images/landingpage/bannerimg1.svg";
import bannerImg2 from "/public/images/landingpage/bannerimg2.svg";

const Banner = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const SliderBox = styled(Box)(() => ({
    '@keyframes slideup': {
      '0%': {
        transform: 'translate3d(0, 0, 0)',
      },
      '100% ': {
        transform: 'translate3d(0px, -100%, 0px)',
      },
    },

    animation: 'slideup 35s linear infinite',
  }));

  const SliderBox2 = styled(Box)(() => ({
    '@keyframes slideDown': {
      '0%': {
        transform: 'translate3d(0, -100%, 0)',
      },
      '100% ': {
        transform: 'translate3d(0px, 0, 0px)',
      },
    },

    animation: 'slideDown 35s linear infinite',
  }));

  return (
    <Box mb={10} sx={{ overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6} sm={8}>
            <BannerContent />
          </Grid>
          {lgUp ? (
            <Grid item xs={12} lg={6}>
              <Box
                p={3.2}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.light,
                  minWidth: '2000px',
                  height: 'calc(100vh - 100px)',
                  maxHeight: '790px',
                }}
              >
                <Stack direction={'row'}>
                  <Box>
                    <SliderBox>
                      <Image src={bannerImg1} alt="banner" priority />
                    </SliderBox>
                    <SliderBox>
                      <Image src={bannerImg1} alt="banner" priority />
                    </SliderBox>
                  </Box>
                  <Box>
                    <SliderBox2>
                      <Image src={bannerImg2} alt="banner" priority />
                    </SliderBox2>
                    <SliderBox2>
                      <Image src={bannerImg2} alt="banner" priority />
                    </SliderBox2>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;
