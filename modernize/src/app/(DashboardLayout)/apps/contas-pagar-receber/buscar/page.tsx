'use client'
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
// import { Button } from '@mui/material';
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/app/components/shared/ParentCard';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Account {
  id: number;
  user_id: number;
  titulo: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: string;
  tipo: string;
}

interface ApiResponse {
  data: Account[];
}

const ContasPagarReceberAdicionarScreen = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`http://api-homolog.spacearena.net/api/conta`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }

        const data: ApiResponse = await response.json();
        setAccounts(data.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Adicionar Nova Conta">
        <div>
          <h1>Listagem de Contas</h1>

          {loading ? (
            <CircularProgress />
          ) : accounts.length > 0 ? (

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data de Vencimento</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.titulo}</TableCell>
                      <TableCell>{account.valor}</TableCell>
                      <TableCell>{account.data_vencimento}</TableCell>
                      <TableCell>
                        {account.tipo === 'a pagar' ? 'A Pagar' : account.tipo === 'a receber' ? 'A Receber' : ''}
                      </TableCell>
                      <TableCell>{account.status.charAt(0).toUpperCase() + account.status.slice(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>Nenhuma conta encontrada.</p>
          )}
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default ContasPagarReceberAdicionarScreen;

