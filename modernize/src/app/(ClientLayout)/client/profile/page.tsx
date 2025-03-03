"use client";
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  Divider,
  Stack
} from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import { IconUser, IconMail, IconPhone, IconMapPin, IconEdit } from '@tabler/icons-react';

const ClientProfile = () => {
  return (
    <PageContainer title="Meu Perfil" description="Gerencie suas informações pessoais">
      <Grid container spacing={3}>
        {/* Cabeçalho do perfil */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar 
                  src="/images/profile/user-1.jpg" 
                  alt="Foto de perfil" 
                  sx={{ width: 100, height: 100, border: '4px solid', borderColor: 'primary.light' }}
                />
                <Box>
                  <Typography variant="h3" mb={1}>João da Silva</Typography>
                  <Typography variant="body1" color="textSecondary">
                    Cliente desde Janeiro de 2023
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<IconEdit size={18} />}
                  sx={{ ml: 'auto' }}
                >
                  Alterar foto
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações pessoais */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" mb={3}>
                Informações Pessoais
              </Typography>
              
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nome completo"
                  defaultValue="João da Silva"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="E-mail"
                  defaultValue="joao.silva@exemplo.com"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Telefone"
                  defaultValue="(11) 98765-4321"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="CPF"
                  defaultValue="123.456.789-00"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Data de nascimento"
                  defaultValue="15/05/1985"
                  variant="outlined"
                />
                
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                >
                  Salvar alterações
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Endereço */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" mb={3}>
                Endereço
              </Typography>
              
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="CEP"
                  defaultValue="01234-567"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Endereço"
                  defaultValue="Rua das Flores, 123"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Complemento"
                  defaultValue="Apto 45"
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Bairro"
                  defaultValue="Jardim Primavera"
                  variant="outlined"
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      defaultValue="São Paulo"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Estado"
                      defaultValue="SP"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                >
                  Salvar endereço
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ClientProfile; 