"use client";
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import { IconEye, IconFileDownload, IconMessage } from '@tabler/icons-react';

// Dados de exemplo para os pedidos
const orders = [
  {
    id: '#ORD-001',
    date: '15/03/2023',
    total: 'R$ 350,00',
    status: 'Entregue',
    statusColor: 'success',
    items: 3
  },
  {
    id: '#ORD-002',
    date: '28/04/2023',
    total: 'R$ 520,00',
    status: 'Em produção',
    statusColor: 'warning',
    items: 5
  },
  {
    id: '#ORD-003',
    date: '10/05/2023',
    total: 'R$ 180,00',
    status: 'Aguardando pagamento',
    statusColor: 'error',
    items: 2
  },
  {
    id: '#ORD-004',
    date: '22/06/2023',
    total: 'R$ 420,00',
    status: 'Enviado',
    statusColor: 'info',
    items: 4
  },
  {
    id: '#ORD-005',
    date: '05/07/2023',
    total: 'R$ 290,00',
    status: 'Entregue',
    statusColor: 'success',
    items: 3
  }
];

const ClientOrders = () => {
  return (
    <PageContainer title="Meus Pedidos" description="Acompanhe seus pedidos atuais">
      <Grid container spacing={3}>
        {/* Cabeçalho */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h3">Meus Pedidos</Typography>
                <Button variant="contained" color="primary">
                  Fazer novo pedido
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de pedidos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de pedidos">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Pedido</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Data</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Itens</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Total</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Status</Typography></TableCell>
                      <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">Ações</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography variant="body1" fontWeight="medium" color="primary">
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items} itens</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            {order.total}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={order.statusColor as any} 
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title="Ver detalhes">
                              <IconButton color="primary" size="small">
                                <IconEye size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Baixar nota fiscal">
                              <IconButton color="success" size="small">
                                <IconFileDownload size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar mensagem">
                              <IconButton color="info" size="small">
                                <IconMessage size={18} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Informações adicionais */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary">
                Precisa de ajuda com seus pedidos? Entre em contato com nosso suporte pelo telefone (11) 1234-5678 ou pelo e-mail suporte@empresa.com.br
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ClientOrders; 