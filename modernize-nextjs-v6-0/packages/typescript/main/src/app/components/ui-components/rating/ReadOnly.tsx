"use client";

import * as React from "react";
import { Rating } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";

const ReadOnly = () => {
  const [value, setValue] = React.useState<number | null>(2);

  return (
    <ChildCard title="Read Only">
      <Rating name="read-only" value={value} readOnly />
    </ChildCard>
  );
};
export default ReadOnly;
