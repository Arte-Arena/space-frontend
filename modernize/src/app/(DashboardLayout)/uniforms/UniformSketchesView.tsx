import React from "react";
import { Box, Typography, Stack, Alert } from "@mui/material";
import { UniformData } from "./types";
import SketchView from "./SketchView";

interface UniformSketchesViewProps {
  uniformData: UniformData;
}

const UniformSketchesView: React.FC<UniformSketchesViewProps> = ({
  uniformData,
}) => {
  if (!uniformData.sketches || uniformData.sketches.length === 0) {
    return (
      <Alert severity="info">
        Não há esboços de uniformes configurados para este orçamento.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Detalhes dos Uniformes
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Visualização dos uniformes configurados para o orçamento #{uniformData.budget_id}
      </Typography>

      <Stack spacing={3} mb={4}>
        {uniformData.sketches.map((sketch) => (
          <SketchView key={sketch.id} sketch={sketch} />
        ))}
      </Stack>
    </Box>
  );
};

export default UniformSketchesView; 