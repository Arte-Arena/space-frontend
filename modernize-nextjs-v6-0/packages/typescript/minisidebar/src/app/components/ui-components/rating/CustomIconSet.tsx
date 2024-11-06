"use client";

import * as React from "react";
import { Rating, Stack } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const CustomIconSet = () => {
  return (
    <ChildCard title="Custom Icon Set">
      <Stack spacing={2}>
        <StyledRating
          name="customized-color"
          defaultValue={2}
          getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        />
      </Stack>
    </ChildCard>
  );
};
export default CustomIconSet;
