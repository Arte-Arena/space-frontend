"use client";
import { Typography, Box, Paper, Container, Grid, Button } from "@mui/material";
import { IconFileInvoice, IconShirt, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

export default function ClientPage() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Bem-vindo à Área do Cliente
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Aqui você pode gerenciar seus orçamentos, explorar uniformes e configurar suas preferências.
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <IconFileInvoice size={48} color="primary" style={{ marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              Gerar Orçamento
            </Typography>
            <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
              Crie orçamentos personalizados para seus projetos de forma rápida e fácil.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              href="/client/budget"
              fullWidth
            >
              Acessar
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <IconShirt size={48} color="primary" style={{ marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              Uniformes
            </Typography>
            <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
              Explore nossa coleção de uniformes personalizados para sua equipe.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              href="/client/uniforms"
              fullWidth
            >
              Acessar
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <IconSettings size={48} color="primary" style={{ marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              Configurações
            </Typography>
            <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
              Gerencie suas preferências e configurações da conta.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              href="/client/settings"
              fullWidth
            >
              Acessar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 