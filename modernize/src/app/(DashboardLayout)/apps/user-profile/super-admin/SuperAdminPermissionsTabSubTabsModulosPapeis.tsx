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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

interface Module {
  id: number;
  name: string;
}

interface RoleModules {
  id: number;
  name: string;
  modules: Module[];
}

const SuperAdminPermissionsTabSubTabsModulosPapeis = () => {
  const [rolesModules, setRolesModules] = useState<RoleModules[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [open, setOpen] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);

  useEffect(() => {
    const fetchRolesAndModules = async () => {
      const token = localStorage.getItem('accessToken');

      // Buscar papéis e módulos
      const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-roles-modules`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const rolesData = await rolesResponse.json();
      setRolesModules(rolesData);

      // Buscar todos os módulos
      const modulesResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-modules`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const modulesData = await modulesResponse.json();
      setAllModules(modulesData);
    };

    fetchRolesAndModules();
  }, []);

  const handleEditClick = (roleId: number, modules: Module[]) => {
    setCurrentRoleId(roleId);
    setSelectedModules(modules.map(module => module.id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRoleId(null);
    setSelectedModules([]);
  };

  const handleSave = async () => {
    if (currentRoleId === null) return;

    // Atualizar os módulos associados ao papel no backend
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/update-role-modules/${currentRoleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moduleIds: selectedModules }),
    });

    // Atualizar o estado local
    setRolesModules(prevRoles =>
      prevRoles.map(role => 
        role.id === currentRoleId ? { ...role, modules: allModules.filter(module => selectedModules.includes(module.id)) } : role
      )
    );

    handleClose();
  };

  const handleDeleteModuleFromRole = async (moduleId: number) => {
    if (!currentRoleId) return;

    // Remover o módulo da associação no backend
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/remove-module-from-role`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roleId: currentRoleId, moduleId }),
    });

    // Atualizar o estado local
    setRolesModules(prevRoles =>
      prevRoles.map(role => 
        role.id === currentRoleId ? { ...role, modules: role.modules.filter(module => module.id !== moduleId) } : role
      )
    );
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
                <TableCell>Módulos</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rolesModules.map((roleModules) => (
                <TableRow key={roleModules.id}>
                  <TableCell>{roleModules.name}</TableCell>
                  <TableCell>
                    {roleModules.modules.map((module) => (
                      <span key={module.id}>
                        {/* {module.name}
                        {roleModules.modules.indexOf(module) !== roleModules.modules.length - 1 && <span>, </span>} */}
                        <span style={{
                          display: 'inline-block',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                          borderRadius: '2px',
                          padding: '2px 4px',
                          margin: '0 2px'
                        }}>
                          {module.name}
                        </span>
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(roleModules.id, roleModules.modules)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de Edição */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Selecionar Módulos</DialogTitle>
          <DialogContent>
            {allModules.map((module) => (
              <FormControlLabel
                key={module.id}
                control={
                  <Checkbox
                    checked={selectedModules.includes(module.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModules([...selectedModules, module.id]);
                      } else {
                        setSelectedModules(selectedModules.filter(id => id !== module.id));
                      }
                    }}
                  />
                }
                label={module.name}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSave} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SuperAdminPermissionsTabSubTabsModulosPapeis;