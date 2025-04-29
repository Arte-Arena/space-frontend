import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import axios from 'axios';

interface Medida {
  id: number;
  genero: string;
  tamanho_camisa: string;
  tamanho_calcao: string;
  largura_camisa: number;
  altura_camisa: number;
  largura_calcao: number;
  altura_calcao: number;
}

const SuperAdminMedidasUniformesTab = () => {
  const [tabValue, setTabValue] = useState<string>('MASCULINO');
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [editedMedidas, setEditedMedidas] = useState<{[key: number]: Medida}>({});

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });

  useEffect(() => {
    const fetchMedidas = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/orcamento/uniformes-medidas');
        setMedidas(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar as medidas de uniformes:', err);
        setError('Erro ao carregar as medidas de uniformes');
        setLoading(false);
      }
    };

    fetchMedidas();
  }, []);

  const filteredMedidas = medidas.filter(medida => medida.genero === tabValue);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleInputChange = (id: number, field: keyof Medida, value: number) => {
    setEditedMedidas(prev => {
      const medida = prev[id] || {...medidas.find(m => m.id === id)!};
      return {
        ...prev,
        [id]: {
          ...medida,
          [field]: value
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const medidasToUpdate = Object.values(editedMedidas);
      
      await axiosInstance.patch('/api/orcamento/uniformes/medidas', {
        medidas: medidasToUpdate
      });

      setMedidas(prev => prev.map(medida => {
        if (editedMedidas[medida.id]) {
          return { ...medida, ...editedMedidas[medida.id] };
        }
        return medida;
      }));

      setEditedMedidas({});
      setSuccess(true);
      setSaving(false);
    } catch (err: any) {
      console.error('Erro ao salvar as alterações:', err);
      setError(err.response?.data?.message || 'Erro ao salvar as alterações');
      setSaving(false);
    }
  };

  return (
    <>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ mt: 2, mb: 3, fontWeight: 'bold' }}
      >
        Medidas de Uniformes
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="medidas uniformes tabs"
          centered
        >
          <Tab label="Masculino" value="MASCULINO" />
          <Tab label="Feminino" value="FEMININO" />
          <Tab label="Infantil" value="INFANTIL" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Medidas atualizadas com sucesso!
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table aria-label="tabela de medidas de uniformes">
              <TableHead>
                <TableRow>
                  <TableCell>Tamanho</TableCell>
                  <TableCell align="center">Largura Camisa (cm)</TableCell>
                  <TableCell align="center">Altura Camisa (cm)</TableCell>
                  <TableCell align="center">Largura Calção (cm)</TableCell>
                  <TableCell align="center">Altura Calção (cm)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMedidas.map((medida) => (
                  <TableRow key={medida.id}>
                    <TableCell component="th" scope="row">
                      {medida.tamanho_camisa}
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={editedMedidas[medida.id]?.largura_camisa ?? medida.largura_camisa}
                        onChange={(e) => handleInputChange(medida.id, 'largura_camisa', Number(e.target.value))}
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={editedMedidas[medida.id]?.altura_camisa ?? medida.altura_camisa}
                        onChange={(e) => handleInputChange(medida.id, 'altura_camisa', Number(e.target.value))}
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={editedMedidas[medida.id]?.largura_calcao ?? medida.largura_calcao}
                        onChange={(e) => handleInputChange(medida.id, 'largura_calcao', Number(e.target.value))}
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={editedMedidas[medida.id]?.altura_calcao ?? medida.altura_calcao}
                        onChange={(e) => handleInputChange(medida.id, 'altura_calcao', Number(e.target.value))}
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={Object.keys(editedMedidas).length === 0 || saving}
              sx={{ minWidth: '150px' }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
            </Button>
          </Grid>
        </>
      )}
    </>
  );
};

export default SuperAdminMedidasUniformesTab; 