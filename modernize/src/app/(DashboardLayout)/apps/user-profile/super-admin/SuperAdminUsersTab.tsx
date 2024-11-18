import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
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

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
}

const SuperAdminUsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleDeleteUser = (userId: number) => {
    // Implement the logic to delete the user with the given ID
    // For example:
    // const updatedUsers = users.filter((user) => user.id !== userId);
    // setUsers(updatedUsers);
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
      const response = await fetch('http://localhost:8000/api/super-admin/get-all-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Configurações do Sistema 1
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Data de Verificação de Email</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.email_verified_at}</TableCell>

                  <TableCell>
                    <ButtonGroup>
                      <Tooltip title="Deletar">
                        <Button onClick={() => setOpenDeleteDialog(true)}>
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                          <Button onClick={() => handleDeleteUser(user.id)} color="secondary">Excluir</Button>
                        </DialogActions>
                      </Dialog>
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
      </div>
    </>
  );
};

export default SuperAdminUsersTab;