'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import ParentCard from '@/app/components/shared/ParentCard';
import React from 'react';

const RadialApexChart = () => {
    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;

    const optionsradialchart = {
        chart: {
            id: 'pie-chart',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
        },
        colors: [primary, secondary, success, warning],
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter() {
                            return 249;
                        },
                    },
                },
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };
    const seriesradialchart = [44, 55, 67, 83];

    // 2
    const optionsradarchart = {
        chart: {
            id: 'pie-chart',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            toolbar: {
                show: false,
            },
        },
        colors: [primary],
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        tooltip: {
            theme: 'dark',
        },
    };
    const seriesradarchart = [
        {
            name: 'Sales',
            data: [80, 50, 30, 40, 100, 20],
        },
    ];

    return (
        <>
            <Grid container spacing={3}>
                <Grid item lg={6} md={12} xs={12}>
                    <ParentCard title="Radialbar Charts">
                        <Chart
                            options={optionsradialchart}
                            series={seriesradialchart}
                            type="radialBar"
                            height="300px"
                            width={'100%'}
                        />
                    </ParentCard>
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                    <ParentCard title="Radar Charts">
                        <Chart
                            options={optionsradarchart}
                            series={seriesradarchart}
                            type="radar"
                            height="300px"
                            width={'100%'}
                        />
                    </ParentCard>
                </Grid>
            </Grid>
        </>
    )
}

export default RadialApexChart
