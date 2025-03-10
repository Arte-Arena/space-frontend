import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Payment } from './types';

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  searchPerformed: boolean;
  budgetId: string;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  isLoading,
  searchPerformed,
  budgetId,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!searchPerformed) {
    return null;
  }

  if (payments.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Nenhum pagamento encontrado para o orçamento #{budgetId}
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID do Pagamento</TableCell>
            <TableCell>Plataforma</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Feito em</TableCell>
            <TableCell>Modificado em</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.platform}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{formatDate(payment.createdAt)}</TableCell>
              <TableCell>{formatDate(payment.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};