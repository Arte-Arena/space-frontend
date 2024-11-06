"use client";

import * as React from "react";
import { Rating } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";

const NoRating = () => {
  return (
    <ChildCard title="No Rating">
      <Rating name="no-value" value={null} />
    </ChildCard>
  );
};
export default NoRating;
