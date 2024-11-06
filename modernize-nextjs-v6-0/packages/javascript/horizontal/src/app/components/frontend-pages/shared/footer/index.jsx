'use client';
import React from 'react';
import { Box, Grid, Typography, Container, Divider, Stack, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
    {
        id: 1,
        children: [
            {
                title: true,
                titleText: 'Applications',
            },
            {
                title: false,
                titleText: 'Kanban',
                link: 'https://modernize-nextjs.adminmart.com/apps/kanban',
            },
            {
                title: false,
                titleText: 'Invoice List',
                link: 'https://modernize-nextjs.adminmart.com/apps/invoice/list',
            },
            {
                title: false,
                titleText: 'eCommerce',
                link: 'https://modernize-nextjs.adminmart.com/apps/ecommerce/shop',
            },
            {
                title: false,
                titleText: 'Chat',
                link: 'https://modernize-nextjs.adminmart.com/apps/chats',
            },
            {
                title: false,
                titleText: 'Tickets',
                link: 'https://modernize-nextjs.adminmart.com/apps/tickets',
            },
            {
                title: false,
                titleText: 'Blog',
                link: 'https://modernize-nextjs.adminmart.com/apps/blog/posts',
            },
        ],
    },
    {
        id: 2,
        children: [
            {
                title: true,
                titleText: 'Forms',
            },
            {
                title: false,
                titleText: 'Form Layout',
                link: 'https://modernize-nextjs.adminmart.com/forms/form-layouts',
            },
            {
                title: false,
                titleText: 'Form Horizontal',
                link: 'https://modernize-nextjs.adminmart.com/forms/form-horizontal',
            },
            {
                title: false,
                titleText: 'Form Wizard',
                link: 'https://modernize-nextjs.adminmart.com/forms/form-wizard',
            },
            {
                title: false,
                titleText: 'Form Validation',
                link: 'https://modernize-nextjs.adminmart.com/forms/form-validation',
            },
            {
                title: false,
                titleText: 'Quill Editor',
                link: 'https://modernize-nextjs.adminmart.com/forms/quill-editor',
            },
        ],
    },
    {
        id: 3,
        children: [
            {
                title: true,
                titleText: 'Tables',
            },
            {
                title: false,
                titleText: 'Basic Table',
                link: 'https://modernize-nextjs.adminmart.com/tables/basic',
            },
            {
                title: false,
                titleText: 'Fixed Header',
                link: 'https://modernize-nextjs.adminmart.com/tables/fixed-header',
            },
            {
                title: false,
                titleText: 'Pagination Table',
                link: 'https://modernize-nextjs.adminmart.com/tables/pagination',
            },
            {
                title: false,
                titleText: 'React Dense Table',
                link: 'https://modernize-nextjs.adminmart.com/react-tables/dense',
            },
            {
                title: false,
                titleText: 'Row Selection Table',
                link: 'https://modernize-nextjs.adminmart.com/react-tables/row-selection',
            },
            {
                title: false,
                titleText: 'Drag n Drop Table',
                link: 'https://modernize-nextjs.adminmart.com/react-tables/drag-drop',
            },
        ],
    },
];

const Footer = () => {
    return (
        <>
            <Container maxWidth="lg" sx={{
                pt: {
                    xs: '30px',
                    lg: '60px'
                }
            }}>
                <Grid container spacing={3} justifyContent="space-between" mb={7}>
                    {footerLinks.map((footerlink, i) => (
                        <Grid item xs={6} sm={4} lg={2} key={i}>
                            {footerlink.children.map((child, i) => (
                                <React.Fragment key={i}>
                                    {
                                        child.title ?
                                            <Typography fontSize="17px" fontWeight="600" mb='22px'>{child.titleText}</Typography>
                                            :
                                            <Link href={child.link} ><Typography sx={{
                                                display: 'block',
                                                padding: '10px 0',
                                                fontSize: '15px',
                                                color: (theme) => theme.palette.text.primary,
                                                '&:hover': {
                                                    color: (theme) => theme.palette.primary.main,
                                                }
                                            }} component="span">{child.titleText}</Typography></Link>
                                    }
                                </React.Fragment>
                            ))}




                        </Grid>
                    ))}
                    <Grid item xs={6} sm={6} lg={2}>
                        <Typography fontSize="17px" fontWeight="600" mb='22px'>Follow us</Typography>

                        <Stack direction="row" gap="20px">
                            <Tooltip title="Facebook">
                                <Link href="#">
                                    <Image src="/images/frontend-pages/icons/icon-facebook.svg" alt="facebook" width={22} height={22} />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Twitter">
                                <Link href="#">
                                    <Image src="/images/frontend-pages/icons/icon-twitter.svg" alt="twitter" width={22} height={22} />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Instagram">
                                <Link href="#">
                                    <Image src="/images/frontend-pages/icons/icon-instagram.svg" alt="instagram" width={22} height={22} />
                                </Link>
                            </Tooltip>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider />

                <Box py="40px" useflexgap="true" flexWrap="wrap" display="flex" justifyContent="space-between">
                    <Stack direction="row" gap={1} alignItems="center">
                        <Image src="/images/logos/logoIcon.svg" width={20} height={20} alt="logo" />
                        <Typography variant="body1" fontSize="15px">All rights reserved by Modernize. </Typography>
                    </Stack>
                    <Typography variant="body1" fontSize="15px">Produced by <Typography component={Link} color="primary.main" href="https://adminmart.com/">AdminMart</Typography>.</Typography>
                </Box>
            </Container >
        </>
    );
};

export default Footer;
