"use client";
import React from "react";
import { Slider } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import DiscreteSliderCode from "@/app/components/forms/form-elements/slider/code/DiscreteSliderCode";

const valuetext = (value: any) => `${value}°C`;

const DiscreteSlider = () => {
  return (
    <ChildCard title="Discrete" codeModel={<DiscreteSliderCode />}>
      <Slider
        aria-label="Temperature"
        defaultValue={30}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />
    </ChildCard>
  );
};

export default DiscreteSlider;
