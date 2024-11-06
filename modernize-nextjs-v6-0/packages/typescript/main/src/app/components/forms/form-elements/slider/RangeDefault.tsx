"use client";

import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SliderValueLabelProps } from "@mui/material/Slider";
import { SliderThumb } from "@mui/material/Slider";
import ChildCard from "@/app/components/shared/ChildCard";
import CustomRangeSlider from "@/app/components/forms/theme-elements/CustomRangeSlider";
import RangesliderCode from "./code/RangesliderCode";

function AirbnbThumbComponent(props: SliderValueLabelProps) {
  const { children, ...other } = props;

  return (
    <SliderThumb {...other}>
      {children}
      <Box
        sx={{
          height: 9,
          width: "2px",
          backgroundColor: "#fff",
        }}
      />
      <Box
        sx={{
          height: "14px",
          width: "2px",
          backgroundColor: "#fff",
          ml: "2px",
        }}
      />
      <Box
        sx={{
          height: 9,
          width: "2px",
          backgroundColor: "#fff",
          ml: "2px",
        }}
      />
    </SliderThumb>
  );
}

const RangeDefault = () => {
  return (
    <ChildCard title="Range" codeModel={<RangesliderCode />}>
      <CustomRangeSlider
        slots={{ thumb: AirbnbThumbComponent }}
        getAriaLabel={(index: any) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
        defaultValue={[20, 40]}
      />
    </ChildCard>
  );
};

export default RangeDefault;
