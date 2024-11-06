'use client';
import React from "react";
import { Box, Stack, Typography, Grid, Container, Divider } from "@mui/material";
import Image from "next/image";
import FeatureTitle from "./FeatureTitle";

const Features = () => {

    return (
        <Box pt={10} pb={10}>
            <Container maxWidth="lg">
                <FeatureTitle />

                <Grid container spacing={3} mt={3}>
                    <Grid item xs sm={6} lg>
                        <Box mb={3} bgcolor="warning.light" borderRadius="24px">
                            <Box px={4} py="65px">
                                <Stack direction="column" spacing={2} textAlign="center">
                                    <Box textAlign="center">
                                        <Image src="/images/svgs/icon-briefcase.svg" alt="icon1" width={40} height={40} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Light & Dark Color Schemes</Typography>
                                    <Typography variant="body1">Choose your preferred visual style effortlessly.</Typography>
                                </Stack>
                            </Box>
                        </Box>
                        <Box textAlign="center" mb={3} bgcolor="secondary.light" borderRadius="24px">
                            <Box px={4} py="50px">
                                <Stack direction="column" spacing={2} textAlign="center">

                                    <Typography variant="h6" fontWeight={700}>12+ Ready to Use Application Designs</Typography>
                                    <Typography variant="body1"> Instantly deployable designs for your applications.</Typography>

                                </Stack>
                            </Box>
                            <Box height="70px">
                                <Image src="/images/frontend-pages/homepage/feature-apps.png" alt="icon1" width={250} height={70} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={5} sx={{
                        order: {
                            xs: 3, lg: 2
                        }
                    }}>
                        <Box textAlign="center" mb={3} bgcolor="primary.light" borderRadius="24px">
                            <Box pt="65px" pb="40px" px={5}>
                                <Image src="/images/logos/logoIcon.svg" alt="logo" height="50" width="50" />
                                <Typography variant="h2" fontWeight="700" mt={4} sx={{
                                    fontSize: {
                                        lg: '40px',
                                        xs: '35px'
                                    }
                                }}>New  Demos</Typography>
                                <Typography variant="body1" mt={2}>Brand new demos to help you build the perfect dashboard: <Typography component="span" fontWeight={600}>Dark and Right-to-Left.</Typography></Typography>
                                <Box mt={5} mb={2}>
                                    <Image src="/images/frontend-pages/homepage/screen1.png" alt="icon1" width={405} height={245} style={{ width: '100%', height: 'auto' }} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs sm={6} lg sx={{
                        order: {
                            xs: 2, lg: 3
                        }
                    }}>
                        <Box textAlign="center" mb={3} bgcolor="success.light" borderRadius="24px">
                            <Box px={4} py="65px">
                                <Stack direction="column" spacing={2} textAlign="center">
                                    <Box textAlign="center">
                                        <Image src="/images/svgs/icon-speech-bubble.svg" alt="icon1" width={40} height={40} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>Code Improvements</Typography>
                                    <Typography variant="body1"> Benefit from continuous improvements and optimizations.</Typography>
                                </Stack>
                            </Box>
                        </Box>
                        <Box textAlign="center" mb={3} bgcolor="error.light" borderRadius="24px">
                            <Box px={4} py="65px">
                                <Stack direction="column" spacing={2} textAlign="center">
                                    <Box textAlign="center">
                                        <Image src="/images/svgs/icon-favorites.svg" alt="icon1" width={40} height={40} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700}>50+ UI Components</Typography>
                                    <Typography variant="body1"> A rich collection for seamless user experiences.</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Features;
