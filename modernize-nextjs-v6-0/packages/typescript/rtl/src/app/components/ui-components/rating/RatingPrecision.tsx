"use client";

import * as React from "react";
import { Rating } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";

const RatingPrecision = () => {
  return (
    <ChildCard title="Rating precision">
      <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
    </ChildCard>
  );
};
export default RatingPrecision;
