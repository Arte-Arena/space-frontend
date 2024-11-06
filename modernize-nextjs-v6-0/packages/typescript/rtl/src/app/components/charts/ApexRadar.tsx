"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import ParentCard from "@/app/components/shared/ParentCard";
import React from "react";
import RadialbarChartsCode from "./code/RadialbarChartsCode";
import RadarChartsCode from "./code/RadarChartsCode";

const ApexRadar = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  const optionsradialchart: any = {
    chart: {
      id: "pie-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary, success, warning],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter() {
              return 249;
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriesradialchart: any = [44, 55, 67, 83];

  // 2
  const optionsradarchart: any = {
    chart: {
      id: "pie-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      toolbar: {
        show: false,
      },
    },
    colors: [primary],
    labels: ["January", "February", "March", "April", "May", "June"],
    tooltip: {
      theme: "dark",
    },
  };
  const seriesradarchart: any = [
    {
      name: "Sales",
      data: [80, 50, 30, 40, 100, 20],
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item lg={6} md={12} xs={12}>
        <ParentCard
          title="Radialbar Charts"
          codeModel={<RadialbarChartsCode />}
        >
          <Chart
            options={optionsradialchart}
            series={seriesradialchart}
            type="radialBar"
            height="300px"
            width={"100%"}
          />
        </ParentCard>
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
        <ParentCard title="Radar Charts" codeModel={<RadarChartsCode />}>
          <Chart
            options={optionsradarchart}
            series={seriesradarchart}
            type="radar"
            height="300px"
            width={"100%"}
          />
        </ParentCard>
      </Grid>
    </Grid>
  );
};

export default ApexRadar;
