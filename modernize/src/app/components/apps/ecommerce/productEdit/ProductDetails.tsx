"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, Button, Grid, Typography, Chip } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { IconPlus } from "@tabler/icons-react";

const new_category = [
  { label: "Computer" },
  { label: "Watches" },
  { label: "Headphones" },
  { label: "Beauty" },
  { label: "Fashion" },
  { label: "Footwear" },
];

const new_tags = [
  { label: "New" },
  { label: "Trending" },
  { label: "Footwear" },
  { label: "Latest" },
];

const ProductDetails = () => {
  return (
    <Box p={3}>
      <Typography variant="h5">Product Details</Typography>
      <Grid container mt={3}>
        {/* 1 */}
        <Grid item xs={12} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="p_cat" sx={{ mt: 0 }}>
            Categories
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            fullWidth
            id="new-category"
            options={new_category}
            getOptionLabel={(option) => option.label}
            defaultValue={[new_category[0], new_category[1]]}
            filterSelectedOptions
            renderInput={(params) => (
              <CustomTextField {...params} placeholder="Categories" />
            )}
          />

          {/* <CustomTextField id="p_cat" fullWidth /> */}
          <Typography variant="body2" mb={2}>
            Add product to a category.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="text" startIcon={<IconPlus size={18} />}>
            Create New Category
          </Button>
        </Grid>
        {/* 1 */}
        <Grid item xs={12} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="p_tag">Tags</CustomFormLabel>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            fullWidth
            id="new-tags"
            options={new_tags}
            getOptionLabel={(option) => option.label}
            defaultValue={[new_tags[1], new_category[2]]}
            filterSelectedOptions
            renderInput={(params) => (
              <CustomTextField {...params} placeholder="Tags" />
            )}
          />
          {/* <CustomTextField id="p_tag" fullWidth /> */}
          <Typography variant="body2" mb={2}>
            Add product to a category.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
