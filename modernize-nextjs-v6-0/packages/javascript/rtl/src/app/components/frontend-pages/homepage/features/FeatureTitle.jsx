'use client';
import React from "react";
import { Box, Grid, Typography, Link, Chip } from "@mui/material";


const FeatureTitle = () => {
    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={6} textAlign="center">
                <Typography variant="body1">Introducing Modernize's Light & Dark Skins, <Box fontWeight={500} component="span">Exceptional Dashboards</Box>, and <br/>Dynamic Pages - Stay Updated on What's New!</Typography>
            </Grid>
        </Grid>
    );
};

export default FeatureTitle;
