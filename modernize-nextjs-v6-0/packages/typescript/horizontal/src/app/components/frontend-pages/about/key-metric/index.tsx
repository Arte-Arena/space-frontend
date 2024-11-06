'use client';
import React from "react";
import { Box, Stack, Typography, Container, Grid, Button } from "@mui/material";
import ContentArea from "./ContentArea";
import Key from "./Key";

const KeyMetric = () => {

    return (
        <Box sx={{
            paddingTop: {
                xs: '40px',
                lg: '90px',
            },
            paddingBottom: {
                xs: '40px',
                lg: '90px',
            }, boxShadow: (theme) => theme.shadows[10]
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item xs={12} lg={5}>
                        <ContentArea />
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <Key />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default KeyMetric;
