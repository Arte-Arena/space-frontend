import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from 'next/link';
import Box from '@mui/material/Box';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
}

const SuperAdminUsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteUser = async (userId: number) => {

    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('User deleted successfully');
    } else {
      console.log('Error deleting user');
    }

    setSelectedUser(null);
    setOpenDeleteDialog(false);
  };

  const handleRequestEmailVerification = (userId: number) => {
    // Implement the logic to request email verification for the user with the given ID
    // For example:
    // const updatedUsers = users.map((user) =>
    //   user.id === userId ? { ...user, email_verified_at: 'pending' } : user
    // );
    // setUsers(updatedUsers);
  };

  const handleRequestPasswordReset = (userId: number) => {
    // Implement the logic to request password reset for the user with the given ID
    // For example:
    // const updatedUsers = users.map((user) =>
    //   user.id === userId ? { ...user, password_reset_requested_at: new Date().toISOString() } : user
    // );
    // setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data);
      console.log(data);
    };

    fetchUsers();
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={Link}
          href="/auth/register"
        >
          Novo Usuário
        </Button>
      </Box>

      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Usuários do Space
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Data de Verificação de Email</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.email_verified_at}</TableCell>

                  <TableCell>
                    <ButtonGroup>
                      <Tooltip title="Deletar">
                        <Button onClick={() => {
                          setSelectedUser(user);
                          setOpenDeleteDialog(true);
                        }}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Solicitar Verificação de Email">
                        <Button onClick={() => handleRequestEmailVerification(user.id)}>
                          <EmailIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Solicitar Troca de Senha">
                        <Button onClick={() => handleRequestPasswordReset(user.id)}>
                          <LockIcon />
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedUser && (
                <>
                  Tem certeza de que deseja excluir este usuário ({selectedUser.email})?
                  Esta ação não pode ser desfeita.
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            {selectedUser && (
              <Button onClick={() => handleDeleteUser(selectedUser.id)} color="secondary">Excluir</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SuperAdminUsersTab;
