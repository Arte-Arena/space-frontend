"use client";
import { useState } from "react";
import { 
  Typography, 
  Box, 
  Paper, 
  Container, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Switch, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  InputLabel, 
  MenuItem, 
  Select,
  Tab,
  Tabs
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [personType, setPersonType] = useState('fisica');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePersonTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonType(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Gerencie suas preferências e configurações da conta.
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="configurações tabs">
            <Tab label="Meus Dados" />
            <Tab label="Preferências" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informações Pessoais
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tipo de Pessoa
              </Typography>
              <RadioGroup
                row
                aria-label="tipo-pessoa"
                name="tipo-pessoa"
                value={personType}
                onChange={handlePersonTypeChange}
              >
                <FormControlLabel value="fisica" control={<Radio />} label="Pessoa Física" />
                <FormControlLabel value="juridica" control={<Radio />} label="Pessoa Jurídica" />
              </RadioGroup>
            </FormControl>
            
            <Grid container spacing={3}>
              {personType === 'fisica' ? (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CPF"
                      variant="outlined"
                      required
                      placeholder="000.000.000-00"
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      variant="outlined"
                      required
                      placeholder="00.000.000/0000-00"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Inscrição Estadual"
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Informações de Contato
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  variant="outlined"
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  variant="outlined"
                  required
                  placeholder="(00) 00000-0000"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Endereço
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CEP"
                  variant="outlined"
                  required
                  placeholder="00000-000"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Endereço"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Número"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Complemento"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Bairro"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    label="Estado"
                    defaultValue=""
                  >
                    <MenuItem value="AC">Acre</MenuItem>
                    <MenuItem value="AL">Alagoas</MenuItem>
                    <MenuItem value="AP">Amapá</MenuItem>
                    <MenuItem value="AM">Amazonas</MenuItem>
                    <MenuItem value="BA">Bahia</MenuItem>
                    <MenuItem value="CE">Ceará</MenuItem>
                    <MenuItem value="DF">Distrito Federal</MenuItem>
                    <MenuItem value="ES">Espírito Santo</MenuItem>
                    <MenuItem value="GO">Goiás</MenuItem>
                    <MenuItem value="MA">Maranhão</MenuItem>
                    <MenuItem value="MT">Mato Grosso</MenuItem>
                    <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                    <MenuItem value="MG">Minas Gerais</MenuItem>
                    <MenuItem value="PA">Pará</MenuItem>
                    <MenuItem value="PB">Paraíba</MenuItem>
                    <MenuItem value="PR">Paraná</MenuItem>
                    <MenuItem value="PE">Pernambuco</MenuItem>
                    <MenuItem value="PI">Piauí</MenuItem>
                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                    <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                    <MenuItem value="RO">Rondônia</MenuItem>
                    <MenuItem value="RR">Roraima</MenuItem>
                    <MenuItem value="SC">Santa Catarina</MenuItem>
                    <MenuItem value="SP">São Paulo</MenuItem>
                    <MenuItem value="SE">Sergipe</MenuItem>
                    <MenuItem value="TO">Tocantins</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Salvar Alterações
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
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
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 