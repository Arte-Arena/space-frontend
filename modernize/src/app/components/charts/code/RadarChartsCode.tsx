import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const RadarChartsCode = () => {
    return (
        <>
            <CodeDialog>
                {`
"use client"

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import Grid from '@mui/material/Grid'
import { useTheme } from "@mui/material/styles";
import React from "react";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radialbar Chart",
  },
];

const RadialbarChart = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

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
    <Chart
        options={optionsradarchart}
        series={seriesradarchart}
        type="radar"
        height="300px"
        width={"100%"}
    />
};

export default RadialbarChart;
`}
            </CodeDialog>
        </>
    );
};

export default RadarChartsCode;
