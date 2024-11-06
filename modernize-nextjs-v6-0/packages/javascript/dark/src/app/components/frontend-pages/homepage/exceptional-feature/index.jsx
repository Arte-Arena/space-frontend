'use client';
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

const StyledAnimationFeature = styled(Box)(() => ({
    width: '100%',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
}));

const StyledAnimationContent = styled(Box)(() => ({
    animation: 'marquee 25s linear infinite'
}));

const StyledAnimationContent2 = styled(Box)(() => ({
    animation: 'marquee2 25s linear infinite'
}));

const slide1 = [
    {
        icon: '/images/frontend-pages/icons/icon-color.svg',
        text: '6 Theme Colors'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sidebar.svg',
        text: 'Dark & Light Sidebar'
    },
    {
        icon: '/images/frontend-pages/icons/icon-pages.svg',
        text: '65+ Page Templates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-components.svg',
        text: '50+ UI Components'
    },
    {
        icon: '/images/frontend-pages/icons/icon-color.svg',
        text: '6 Theme Colors'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sidebar.svg',
        text: 'Dark & Light Sidebar'
    },
    {
        icon: '/images/frontend-pages/icons/icon-pages.svg',
        text: '65+ Page Templates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-components.svg',
        text: '50+ UI Components'
    },
    {
        icon: '/images/frontend-pages/icons/icon-color.svg',
        text: '6 Theme Colors'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sidebar.svg',
        text: 'Dark & Light Sidebar'
    },
    {
        icon: '/images/frontend-pages/icons/icon-pages.svg',
        text: '65+ Page Templates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-components.svg',
        text: '50+ UI Components'
    },
]

const slide2 = [
    {
        icon: '/images/frontend-pages/icons/icon-framework.svg',
        text: 'Material Ui'
    },
    {
        icon: '/images/frontend-pages/icons/icon-icons.svg',
        text: '3400+ Icon'
    },
    {
        icon: '/images/frontend-pages/icons/icon-responsive.svg',
        text: 'Fully Responsive'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sass.svg',
        text: 'Sassbase CSS'
    },
    {
        icon: '/images/frontend-pages/icons/icon-framework.svg',
        text: 'Material Ui'
    },
    {
        icon: '/images/frontend-pages/icons/icon-icons.svg',
        text: '3400+ Icon'
    },
    {
        icon: '/images/frontend-pages/icons/icon-responsive.svg',
        text: 'Fully Responsive'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sass.svg',
        text: 'Sassbase CSS'
    },
    {
        icon: '/images/frontend-pages/icons/icon-framework.svg',
        text: 'Material Ui'
    },
    {
        icon: '/images/frontend-pages/icons/icon-icons.svg',
        text: '3400+ Icon'
    },
    {
        icon: '/images/frontend-pages/icons/icon-responsive.svg',
        text: 'Fully Responsive'
    },
    {
        icon: '/images/frontend-pages/icons/icon-sass.svg',
        text: 'Sassbase CSS'
    },
]

const slide3 = [
    {
        icon: '/images/frontend-pages/icons/icon-customize.svg',
        text: 'Easy to Customize'
    },
    {
        icon: '/images/frontend-pages/icons/icon-chart.svg',
        text: 'Lots of Chart Options'
    },
    {
        icon: '/images/frontend-pages/icons/icon-table.svg',
        text: 'Lots of Table Examples'
    },
    {
        icon: '/images/frontend-pages/icons/icon-update.svg',
        text: 'Regular Updates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-support.svg',
        text: 'Dedicated Support'
    },
    {
        icon: '/images/frontend-pages/icons/icon-customize.svg',
        text: 'Easy to Customize'
    },
    {
        icon: '/images/frontend-pages/icons/icon-chart.svg',
        text: 'Lots of Chart Options'
    },
    {
        icon: '/images/frontend-pages/icons/icon-table.svg',
        text: 'Lots of Table Examples'
    },
    {
        icon: '/images/frontend-pages/icons/icon-update.svg',
        text: 'Regular Updates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-support.svg',
        text: 'Dedicated Support'
    },
    {
        icon: '/images/frontend-pages/icons/icon-customize.svg',
        text: 'Easy to Customize'
    },
    {
        icon: '/images/frontend-pages/icons/icon-chart.svg',
        text: 'Lots of Chart Options'
    },
    {
        icon: '/images/frontend-pages/icons/icon-table.svg',
        text: 'Lots of Table Examples'
    },
    {
        icon: '/images/frontend-pages/icons/icon-update.svg',
        text: 'Regular Updates'
    },
    {
        icon: '/images/frontend-pages/icons/icon-support.svg',
        text: 'Dedicated Support'
    },
]

const ExceptionalFeature = () => {

    const theme = useTheme();

    const StyledFeatureBox = styled(Box)(() => ({
        boxShadow: theme.shadows[10],
        backgroundColor: theme.palette.background.default,
        minHeight: '72px',
        width: '315px',
        borderRadius: '16px',marginTop: '15px',marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexShrink: 0
    }));

    return (
        <>
            <Container sx={{
                maxWidth: '1400px !important',
            }}>
                <Box bgcolor="primary.light" borderRadius="24px" sx={{
                    py: {
                        xs: '40px',
                        lg: '70px'
                    }
                }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3} alignItems="center" justifyContent="center">
                            <Grid item xs={12} lg={7} sm={9}>
                                <Typography variant="h4" mb="55px" textAlign="center" fontWeight={700} fontSize="40px" lineHeight="1.2" sx={{
                                    fontSize: {
                                        lg: '40px',
                                        xs: '30px'
                                    }
                                }}>Enjoy unparalleled features & exceptional flexibility.</Typography>
                            </Grid>
                        </Grid>
                    </Container>

                    <StyledAnimationFeature>
                        <StyledAnimationContent display="flex" gap="30px">
                            {slide1.map((slide, i) => (
                                <StyledFeatureBox key={i}>
                                    <Image src={slide.icon} alt="color" width={24} height={24} />
                                    <Typography fontSize="15px" fontWeight={600}>{slide.text}</Typography>
                                </StyledFeatureBox>
                            ))}
                        </StyledAnimationContent>
                    </StyledAnimationFeature>

                    <StyledAnimationFeature>
                        <StyledAnimationContent2 display="flex" gap="30px">
                            {slide2.map((slide, i) => (
                                <StyledFeatureBox key={i}>
                                    <Image src={slide.icon} alt="color" width={24} height={24} />
                                    <Typography fontSize="15px" fontWeight={600}>{slide.text}</Typography>
                                </StyledFeatureBox>
                            ))}

                        </StyledAnimationContent2>
                    </StyledAnimationFeature>

                    <StyledAnimationFeature>
                        <StyledAnimationContent display="flex" gap="30px">
                            {slide3.map((slide, i) => (
                                <StyledFeatureBox key={i}>
                                    <Image src={slide.icon} alt="color" width={24} height={24} />
                                    <Typography fontSize="15px" fontWeight={600}>{slide.text}</Typography>
                                </StyledFeatureBox>
                            ))}
                        </StyledAnimationContent>
                    </StyledAnimationFeature>
                </Box>
            </Container>
        </>
    );
};

export default ExceptionalFeature;
