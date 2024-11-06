'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import OtherFrameworkTitle from './OtherFrameworkTitle';
import Image from 'next/image';
import AngularIcon from "/public/images/landingpage/f-angular.png";
import VueIcon from "/public/images/landingpage/f-vue.png";
import BootstrapIcon from "/public/images/landingpage/f-bootstrap.png";
import NetIcon from "/public/images/landingpage/f-net.png";
import NuxtIcon from "/public/images/landingpage/f-nuxt.png";
import Link from 'next/link';

const frameworks = [
    {
        bgcolor: '#FFEEF9',
        color: '#F50D51',
        name: 'Angular',
        img: AngularIcon,
        link: "https://adminmart.com/product/modernize-angular-material-dashboard/?ref=21"
    },
    {
        bgcolor: '#E8F6F0',
        color: '#2D9566',
        name: 'VueJs',
        img: VueIcon,
        link: "https://adminmart.com/product/modernize-vuetify-vue-admin-dashboard/?ref=21"
    },
    {
        bgcolor: '#F1E7FB',
        color: '#7811F5',
        name: 'Bootstrap',
        img: BootstrapIcon,
        link: "https://adminmart.com/product/modernize-bootstrap-5-admin-template/?ref=21"
    },
    {
        bgcolor: '#E3F4FF',
        color: '#2F495E',
        name: '.Net',
        img: NetIcon,
        link: "https://themeforest.net/item/modernize-aspnet-core-mvc-bootstrap-admin-dashboard-template/49638974"
    },
    {
        bgcolor: '#EAFBF8',
        color: '#2F495E',
        name: 'Nuxt.js',
        img: NuxtIcon,
        link: "https://adminmart.com/product/modernize-nuxt-js-admin-dashboard/?ref=21"
    },
];
const OtherFramework = () => {
    return (
        <Box
            sx={{
                py: {
                    xs: '70px',
                    lg: '120px',
                },
            }}
        >
            <Container maxWidth="lg">
                {/* Title */}
                <OtherFrameworkTitle />

                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} mt={11}>
                    {frameworks.map((framework, i) => (
                        <Link href={framework.link} target='_blank'>
                            <Box p={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column" bgcolor={framework.bgcolor} width={180} height={180} sx={{
                                transition: ".1s ease-in",
                                "&:hover": {
                                    transform: "scale(1.1)"
                                }
                            }}>
                                <Box height="50px">
                                    <Image src={framework.img} alt="angular" width={50} />
                                </Box>
                                <Typography variant="body1" mt="12px" color={framework.color}>{framework.name} Version</Typography>
                            </Box>
                        </Link>
                    ))}


                </Box>
            </Container>

        </Box>
    );
};

export default OtherFramework;
