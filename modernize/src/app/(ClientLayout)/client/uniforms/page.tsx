"use client";
import { Typography, Box, Paper, Container, Grid } from "@mui/material";

const UniformsPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Uniformes
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Explore nossa coleção de uniformes personalizados para sua equipe.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Catálogo de uniformes será implementado aqui */}
            <Grid item xs={12}>
              <Typography variant="body2" color="primary">
                Catálogo em desenvolvimento...
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default UniformsPage; 