import { Box } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

const CustomToolbar = () => {
        
    return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
