'use client';
import React from "react";
import { Box, Grid, Typography, Container, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import useMediaQuery from '@mui/material/useMediaQuery';

const C2a = () => {

    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smUp = useMediaQuery((theme) => theme.breakpoints.only('sm'));

    return (
        <>
            <Container sx={{
                maxWidth: '1400px !important',
                py: {
                    xs: '20px',
                    lg: '30px',
                },
            }}>
                <Box bgcolor="primary.light" borderRadius="24px" overflow="hidden" position="relative" sx={{
                    py: {
                        xs: '40px',
                        lg: '70px'
                    }
                }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} lg={6} sm={8}>
                                <Typography variant="h4" mb={3} fontWeight={700} fontSize="40px" lineHeight="1.4" sx={{
                                    fontSize: {
                                        lg: '40px',
                                        xs: '30px'
                                    }
                                }}>Develop with feature-rich Next.js Dashboard</Typography>
                                <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useflexgap="true" flexWrap="wrap" mb={3}>
                                    <Button variant="contained" size="large" href="/auth/auth1/login">Member Login</Button>
                                    <Button variant="outlined" size="large" href="/auth/auth1/register">Register as Member</Button>
                                </Stack> 
                                <Typography fontSize="14px"><Box fontWeight={600} component="span">One-time purchase -</Box> no recurring fees.</Typography>
                            </Grid>
                        </Grid>
                    </Container>

                    {lgUp ?
                        <Image src='/images/frontend-pages/homepage/design-collection.png' alt="design" width={900} height={365} style={{
                            position: 'absolute', right: 0,
                            top: 0, width: 'auto', height: '100%',
                        }} /> : null

                    }

                    {smUp ?
                        <Image src='/images/frontend-pages/homepage/design-collection.png' alt="design" width={900} height={365} style={{
                            position: 'absolute', right: '-200px',
                            top: 0, width: 'auto', height: '100%',
                        }} /> : null

                    }



                </Box>
            </Container>
        </>
    );
};

export default C2a;
