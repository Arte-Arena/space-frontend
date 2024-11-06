"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import ParentCard from "@/app/components/shared/ParentCard";
import React from "react";
import DoughtnutChartCode from "./code/DoughtnutChartCode";
import PieChartsCode from "./code/PieChartsCode";

const ApexDonut = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  // 1
  const optionsdoughnutchart: any = {
    chart: {
      id: "donut-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70px",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  const seriesdoughnutchart = [45, 15, 27, 18, 35];

  // 2
  const optionspiechart: any = {
    chart: {
      id: "pie-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70px",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  const seriespiechart = [45, 15, 27, 18, 35];

  return (
    <Grid container spacing={3}>
      <Grid item lg={6} md={12} xs={12}>
        <ParentCard title="Doughnut Charts" codeModel={<DoughtnutChartCode />}>
          <Chart
            options={optionsdoughnutchart}
            series={seriesdoughnutchart}
            type="donut"
            height="300px"
            width={"100%"}
          />
        </ParentCard>
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
        <ParentCard title="Pie Charts" codeModel={<PieChartsCode />}>
          <Chart
            options={optionspiechart}
            series={seriespiechart}
            type="pie"
            height="300px"
            width={"100%"}
          />
        </ParentCard>
      </Grid>
    </Grid>
  );
};

export default ApexDonut;
