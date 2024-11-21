import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface Role {
  id: number;
  name: string;
}

const SuperAdminPermissionsTabSubTabsModulosPapeis = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(0);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRoles(data);
    };
    fetchRoles();
  }, []);

  const handleEditRole = (roleId: number) => {
    const role = roles.find((role) => role.id === roleId);
    if (role) {
      setEditedRoleName(role.name);
      setSelectedRoleId(roleId);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleConfirmEditRole = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/upsert-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: selectedRoleId,
          role_name: editedRoleName,
        }),
      });
      if (response.ok) {
        const updatedRoles = roles.map((role) =>
          role.id === selectedRoleId ? { ...role, name: editedRoleName } : role
        );
        setRoles(updatedRoles);
        setOpenEditDialog(false);
      } else {
        throw new Error('Failed to edit role');
      }
    } catch (error) {
      setOpenEditDialog(false);
    }
  };

  const handleDeleteRole = (roleId: number) => {
    setSelectedRoleId(roleId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDeleteRole = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/delete-role/${selectedRoleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedRoles = roles.filter((role) => role.id !== selectedRoleId);
        setRoles(updatedRoles);
        setOpenDeleteDialog(false);
      } else {
        throw new Error('Failed to delete role');
      }
    } catch (error) {
      setOpenDeleteDialog(false);
    }
  };

  

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          Papéis de Usuários do Space
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Papel</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditRole(role.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRole(role.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o papel "{roles.find((role) => role.id === selectedRoleId)?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDeleteRole} color="secondary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Papel</DialogTitle>
        <DialogContent>
          <TextField
            value={editedRoleName}
            onChange={(e) => setEditedRoleName(e.target.value)}
            label="Nome do papel"
            fullWidth
            sx={{ mt: 2 }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleConfirmEditRole} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SuperAdminPermissionsTabSubTabsModulosPapeis;