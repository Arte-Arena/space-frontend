"use client";
import { Grid, Typography, Card, CardContent, Box, Button } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import { IconUser, IconShoppingCart, IconHistory, IconSettings } from '@tabler/icons-react';

const ClientDashboard = () => {
  return (
    <PageContainer title="Área do Cliente" description="Bem-vindo à sua área de cliente">
      <Grid container spacing={3}>
        {/* Boas-vindas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h3" mb={2}>Bem-vindo à sua Área de Cliente</Typography>
              <Typography variant="body1">
                Aqui você pode gerenciar seus pedidos, visualizar seu histórico de compras e atualizar suas informações.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cards de acesso rápido */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: '50%', mb: 2 }}>
                <IconUser size={32} color="#fff" />
              </Box>
              <Typography variant="h6" mb={1}>Meu Perfil</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Visualize e edite suas informações pessoais
              </Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 'auto' }}>
                Acessar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: '50%', mb: 2 }}>
                <IconShoppingCart size={32} color="#fff" />
              </Box>
              <Typography variant="h6" mb={1}>Meus Pedidos</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Acompanhe seus pedidos atuais
              </Typography>
              <Button variant="outlined" color="success" sx={{ mt: 'auto' }}>
                Acessar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: '50%', mb: 2 }}>
                <IconHistory size={32} color="#fff" />
              </Box>
              <Typography variant="h6" mb={1}>Histórico</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Veja seu histórico completo de compras
              </Typography>
              <Button variant="outlined" color="warning" sx={{ mt: 'auto' }}>
                Acessar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: '50%', mb: 2 }}>
                <IconSettings size={32} color="#fff" />
              </Box>
              <Typography variant="h6" mb={1}>Configurações</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ajuste suas preferências de conta
              </Typography>
              <Button variant="outlined" color="info" sx={{ mt: 'auto' }}>
                Acessar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ClientDashboard; 