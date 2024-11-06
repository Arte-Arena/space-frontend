import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import QuillEdit from "@/app/components/forms/form-quill/QuillEdit";

const GeneralCard = () => {
  return (
    <Box p={3}>
      <Typography variant="h5">General</Typography>

      <Grid container mt={3}>
        {/* 1 */}
        <Grid item xs={12} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="p_name" sx={{ mt: 0 }}>
            Product Name{" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            id="p_name"
            placeholder="Product Name"
            value="Sample Product"
            fullWidth
          />
          <Typography variant="body2">
            A product name is required and recommended to be unique.
          </Typography>
        </Grid>

        <Grid item xs={12} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="desc">Description</CustomFormLabel>
        </Grid>
        <Grid item xs={12}>
          <QuillEdit />
          <Typography variant="body2">
            Set a description to the product for better visibility.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralCard;
