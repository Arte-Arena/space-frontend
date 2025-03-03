"use client";
import { Typography, Box, Paper, Container } from "@mui/material";

const BudgetPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gerar Orçamento
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Aqui você poderá gerar orçamentos personalizados para seus projetos.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {/* Formulário de orçamento será implementado aqui */}
          <Typography variant="body2" color="primary">
            Funcionalidade em desenvolvimento...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default BudgetPage; 