import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

interface Role {
  id: number;
  name: string;
}

interface UserRoles {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

const SuperAdminPermissionsTabSubTabsPapeisUsuarios = () => {
  const [users, setUsers] = useState<UserRoles[]>([]);

  const [rolesModules, setRolesModules] = useState<UserRoles[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);

  const [open, setOpen] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (userId: number, roles: Role[]) => {
    setCurrentUserId(userId);
    setSelectedRoles(roles.map(role => role.id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUserId(null);
    setSelectedRoles([]);
  };

  const handleSave = async () => {
    if (isLoading || currentUserId === null) return;

    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/upsert-user-roles`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: currentUserId,
        role_ids: selectedRoles
      }),
    });

    setRolesModules((prevRoles) =>
      prevRoles.map((role) =>
        role.id === currentUserId
          ? { ...role, modules: allRoles.filter((role) => selectedRoles.includes(role.id)) }
          : role
      )
    );

    setIsLoading(false);
    handleClose();
  };

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-users-roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: UserRoles[] = await response.json();
      setUsers(data);

      // Buscar todos os módulos
      const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const rolesData = await rolesResponse.json();
      setAllRoles(rolesData);
    };

    fetchUsersAndRoles();
  }, []);

  return (
    <>
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
                <TableCell>Usuário</TableCell>
                <TableCell>Papéis</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>

                  <TableCell>
                    <Tooltip title={user.email}>
                      <span>{user.name}</span>
                    </Tooltip>

                  </TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                      <span key={role.id}>{role.name}, </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user.id, user.roles)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Selecionar Papéis</DialogTitle>
          <DialogContent>
            {allRoles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role.id]);
                      } else {
                        setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                      }
                    }}
                  />
                }
                label={role.name}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SuperAdminPermissionsTabSubTabsPapeisUsuarios;