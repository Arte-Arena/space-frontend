"use client";
import { Typography, Box, Paper, Container, Divider, List, ListItem, ListItemText, Switch } from "@mui/material";

const SettingsPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Gerencie suas preferências e configurações da conta.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mt: 2 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="Notificações por e-mail" 
                secondary="Receba atualizações sobre seus pedidos e orçamentos"
              />
              <Switch defaultChecked />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="Notificações no sistema" 
                secondary="Receba notificações dentro da plataforma"
              />
              <Switch defaultChecked />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="Tema escuro" 
                secondary="Altere a aparência da interface"
              />
              <Switch />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 