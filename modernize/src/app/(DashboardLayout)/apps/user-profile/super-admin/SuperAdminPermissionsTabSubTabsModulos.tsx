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
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


interface Module {
  id: number;
  name: string;
}

const SuperAdminPermissionsTabSubTabsModulosPapeis = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [moduleToDeleteId, setModuleToDeleteId] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedModuleName, setEditedModuleName] = useState('');
  const [moduleToEditId, setModuleToEditId] = useState<number | null>(null);

  

  useEffect(() => {
    const fetchModules = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-modules`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setModules(data);
    };

    fetchModules();
  }, []);

  const handleEditModule = async (moduleId: number) => {
    const module = modules.find((m) => m.id === moduleId);
    if (module) {
      setEditedModuleName(module.name);
      setModuleToEditId(moduleId);
      setOpenEditDialog(true);

      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/update-module/${moduleId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editedModuleName,
          }),
        });

        if (response.ok) {
          const updatedModules = await fetchModules();
          setModules(updatedModules);
        } else {
          console.error('Error updating module:', await response.text());
        }
      } catch (error) {
        console.error('Error:', (error as Error).message);
      }
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleConfirmEditModule = async () => {
    if (moduleToEditId !== null && editedModuleName !== '') {

      const updatedModules = modules.map((module) =>
        module.id === moduleToEditId ? { ...module, name: editedModuleName } : module
      );
      setModules(updatedModules);

      setOpenEditDialog(false);
    }
  };



  const handleDeleteModule = (moduleId: number) => {
    setModuleToDeleteId(moduleId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setModuleToDeleteId(null);
  };

  const handleConfirmDeleteModule = async () => {
    if (moduleToDeleteId !== null) {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/delete-module/${moduleToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedModules = await fetchModules();
        setModules(updatedModules);
      } else {
        console.error('Error deleting module:', await response.text());
      }
    }
    setOpenDeleteDialog(false);
    setModuleToDeleteId(null);
  };

  const fetchModules = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-all-modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
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
          Módulos do Space
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>{module.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditModule(module.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteModule(module.id)}
                    >
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
            Tem certeza de que deseja excluir este módulo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDeleteModule} color="secondary">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Módulo</DialogTitle>
        <DialogContent>
          <TextField
            value={editedModuleName}
            onChange={(e) => setEditedModuleName(e.target.value)}
            label="Nome do módulo"
            fullWidth
            sx={{ mt: 2 }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleConfirmEditModule} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
};

export default SuperAdminPermissionsTabSubTabsModulosPapeis;