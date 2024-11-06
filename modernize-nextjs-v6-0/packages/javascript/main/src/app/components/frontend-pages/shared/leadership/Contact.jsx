'use client';
import React from "react";
import { Box, Stack, Typography, Link, AvatarGroup, Container, Avatar } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';


const Contact = () => {

    //   sidebar
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    return (

        <Box bgcolor="primary.main" borderRadius={0} textAlign="center" py="14px" mt={5} position="relative">
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing="16px" justifyContent="center" alignItems="center">
                    <AvatarGroup>
                        <Avatar alt="Remy Sharp" src='/images/profile/user-1.jpg' sx={{ width: 44, height: 44 }} />
                        <Avatar alt="Travis Howard" src='/images/profile/user-2.jpg' sx={{ width: 44, height: 44 }} />
                    </AvatarGroup>
                    <Typography variant="body1" color="white" fontSize="16px">Save valuable time and effort spent searching for a solution.</Typography>
                    <Link href="/" underline="always" sx={{
                        textDecorationColor: 'white'
                    }}><Typography component="span" fontWeight={600} color="white" fontSize="16px">Contact us now</Typography></Link>
                </Stack>
            </Container>

        </Box>
    );
};

export default Contact;
