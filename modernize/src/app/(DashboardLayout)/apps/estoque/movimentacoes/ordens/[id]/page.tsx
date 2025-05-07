'use client';
import {
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useParams, useRouter } from "next/navigation";
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingBasket as ShoppingBasketIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Scale as ScaleIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { IconBuilding } from "@tabler/icons-react";
import { useThemeMode } from "@/utils/useThemeMode";

dayjs.locale("pt-br");

// Interfaces (mantidas como no seu código original)
interface Movimentacao {
  tipo_movimentacao?: string;
  data_movimentacao?: string;
  documento?: string;
  numero_pedido?: string;
  localizacao_origem?: string;
  quantidade?: number;
  estoque?: Estoque;
  observacoes?: string;
  fornecedor?: Fornecedor;
}

interface Estoque {
  unidade_medida?: string;
  nome?: string;
}

interface Fornecedor {
  nome_completo: string;
  email: string;
  celular: string;
  cnpj: string;
  endereco: string;
  numero: string;
  cidade: string;
  uf: string;
  produtos?: Produto[];
}

interface Produto {
  id: string;
  nome: string;
  peso: number;
  type: string;
  altura: number;
  largura: number;
  comprimento: number;
  preco: number;
}

const Alerta = forwardRef<HTMLDivElement, AlertProps>(function Alerta(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function VisualizacaoMovimentacao() {
  const theme = useTheme();
  const [movimentacao, setMovimentacao] = useState<Movimentacao | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);
  const formatDate = (date: string): string => dayjs(date).format("DD/MM/YYYY");

  const themeMode = useThemeMode();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!accessToken) {
    router.push('/auth/login');
    return null;
  }

  if (!id) {
    setSnackbar({
      open: true,
      message: "ID não encontrado!",
      severity: "error",
    });
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">ID não encontrado!</Typography>
      </Box>
    )
  }

  useEffect(() => {
    const fetchMovimentacao = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/movimentacao/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Erro ao buscar movimentação: ${response.status}`);
        }
        const data = await response.json();
        setMovimentacao(data);
      } catch (error: any) {
        setError(error.message);
        setSnackbar({
          open: true,
          message: error.message || "Erro ao carregar movimentação!",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMovimentacao();
  }, [id, accessToken]);


  const getAvatarColor = (theme: any, baseColor: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info') => {
    const bgColor = theme.palette.mode === 'dark'
      ? theme.palette[baseColor].dark
      : theme.palette[baseColor].light;

    return {
      bgcolor: bgColor,
      color: theme.palette.getContrastText(bgColor)
    };
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alerta severity="error" sx={{ mb: 3 }}>
          {error}
        </Alerta>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {movimentacao?.tipo_movimentacao === 'entrada' ? 'Entrada de Estoque' : 'Saída de Estoque'}
          <Chip
            label={movimentacao?.tipo_movimentacao === 'entrada' ? 'Entrada' : 'Saída'}
            color={movimentacao?.tipo_movimentacao === 'entrada' ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon fontSize="small" />
          {movimentacao?.data_movimentacao ? formatDate(movimentacao.data_movimentacao) : "-"}
        </Typography>
      </Paper>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
          '& .MuiTab-root': {
            color: theme.palette.text.primary, // Garante visibilidade do texto e ícone
          }
        }}
        variant="fullWidth"
      >
        <Tab
          label="Detalhes"
          icon={<InventoryIcon />}
          iconPosition="start"
          sx={{ minHeight: 48 }}
        />
        <Tab
          label="Fornecedor"
          icon={<LocalShippingIcon />}
          iconPosition="start"
          disabled={!movimentacao?.fornecedor}
          sx={{ minHeight: 48 }}
        />
        <Tab
          label="Produtos do Fornecedor"
          icon={<ShoppingBasketIcon />}
          iconPosition="start"
          disabled={!movimentacao?.fornecedor?.produtos?.length}
          sx={{ minHeight: 48 }}
        />
      </Tabs>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AssignmentIcon /> Informações da Movimentação
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'primary')}>
                      <DescriptionIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Documento"
                    secondary={movimentacao?.documento || "Não informado"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'primary')}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Número do Pedido"
                    secondary={movimentacao?.numero_pedido || "Não informado"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'primary')}>
                      <LocationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Localização de Origem"
                    secondary={movimentacao?.localizacao_origem || "Não informado"}
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <InventoryIcon /> Detalhes do Estoque
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'secondary')}>
                      <ScaleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Quantidade"
                    secondary={`${movimentacao?.quantidade} ${movimentacao?.estoque?.unidade_medida || ''}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'secondary')}>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Item do Estoque"
                    secondary={movimentacao?.estoque?.nome || "Não informado"}
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{
                mt: 3,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DescriptionIcon /> Observações
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
                <Typography variant="body1">
                  {movimentacao?.observacoes || "Nenhuma observação registrada."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabIndex === 1 && movimentacao?.fornecedor && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <LocalShippingIcon /> Informações do Fornecedor
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <BusinessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Nome"
                    secondary={movimentacao.fornecedor.nome_completo}
                    secondaryTypographyProps={{ sx: { fontWeight: 500 } }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email"
                    secondary={movimentacao.fornecedor.email}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Telefone"
                    secondary={movimentacao.fornecedor.celular}
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <CreditCardIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="CNPJ"
                    secondary={movimentacao.fornecedor.cnpj}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Endereço"
                    secondary={`${movimentacao.fornecedor.endereco}, ${movimentacao.fornecedor.numero}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={getAvatarColor(theme, 'success')}>
                      <IconBuilding />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Cidade/UF"
                    secondary={`${movimentacao.fornecedor.cidade} / ${movimentacao.fornecedor.uf}`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabIndex === 2 && movimentacao?.fornecedor?.produtos && movimentacao.fornecedor.produtos.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2
          }}>
            <ShoppingBasketIcon /> Produtos do Fornecedor
          </Typography>

          <Grid container spacing={3}>
            {movimentacao.fornecedor.produtos.map((produto: Produto) => (
              <Grid item xs={12} sm={6} md={4} key={produto.id}>
                <Paper elevation={2} sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <Typography variant="h6" gutterBottom sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 600
                  }}>
                    {produto.nome}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5}>
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {produto.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Peso:</strong> {produto.peso} kg
                    </Typography>
                    <Typography variant="body2">
                      <strong>Dimensões:</strong> {produto.altura} × {produto.largura} × {produto.comprimento} cm
                    </Typography>
                    <Typography variant="body2">
                      <strong>Preço:</strong> {produto.preco
                        ? Number(produto.preco).toFixed(2)
                        : "0,00"}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alerta onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alerta>
      </Snackbar>
    </Box>
  );
}