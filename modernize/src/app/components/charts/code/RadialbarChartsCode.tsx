import CodeDialog from "@/app/components/shared/CodeDialog";
import React from "react";
const RadialbarChartsCode = () => {
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

  return (
    <Chart
        options={optionsradialchart}
        series={seriesradialchart}
        type="radialBar"
        height="300px"
        width={"100%"}
    />
  );
};

export default RadialbarChart;
`}
            </CodeDialog>
        </>
    );
};

export default RadialbarChartsCode;
