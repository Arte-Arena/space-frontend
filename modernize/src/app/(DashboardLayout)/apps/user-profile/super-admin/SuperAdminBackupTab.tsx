import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';

interface Backup {
  id: number;
  nome: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  tamanho: number;
  created_at: string;
  updated_at: string;
}

const SuperAdminBackupTab = () => {
  const [page, setPage] = useState<number>(1);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const { isFetching, error, data } = useQuery({
    queryKey: ['backupsData', page],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-backups?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h4" align="center" sx={{ mt: 2 }}>
          Monitorar Backups
        </Typography>
        {isFetching && <Typography variant="body1" align="center">Loading...</Typography>}
        {error && <Typography variant="body1" align="center">Error loading data</Typography>}
        {data && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Data Início</TableCell>
                    <TableCell>Data Fim</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tamanho</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((backup: Backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>{backup.id}</TableCell>
                      <TableCell>{backup.nome}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('pt-BR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }).format(
                          new Date(new Date(backup.data_inicio).getTime() - 4 * 60 * 60 * 1000),
                        )}
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('pt-BR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }).format(
                          new Date(new Date(backup.data_fim).getTime() - 4 * 60 * 60 * 1000),
                        )}
                      </TableCell>
                      <TableCell>{backup.status}</TableCell>
                      <TableCell>{(backup.tamanho / 1048576).toFixed(2)} MB</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={data.last_page}
              page={data.current_page}
              onChange={handlePageChange}
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SuperAdminBackupTab;
