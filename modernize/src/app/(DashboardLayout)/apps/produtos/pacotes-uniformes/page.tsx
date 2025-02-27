'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CircularProgress from '@mui/material/CircularProgress';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from "@mui/material";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { FormControl, FormControlLabel } from '@mui/material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';


// Importando o tipo do arquivo separado
import { PacoteUniforme } from './types';

const ProdutosPacotesUniformesScreen = () => {
  const [selectedPacote, setSelectedPacote] = useState<PacoteUniforme | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<PacoteUniforme | null>(null);

  const accessToken = localStorage.getItem('accessToken');

  const { data: pacotesUniforme, isLoading: isLoadingPacotesUniforme } = useQuery<PacoteUniforme[]>({
    queryKey: ['pacotes-uniforme'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API}/api/produto/pacote/uniforme/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => res.json()),
  });

  const handleOpenModal = (pacote: PacoteUniforme) => {
    setSelectedPacote(pacote);
    setOpenModal(true);
  };
  
  // Renderiza um array como chips ou texto
  const renderArrayItems = (items: string[] | null | undefined): React.ReactNode => {
    if (!items || items.length === 0) return "Nenhum";
    if (typeof items === 'string') return items;

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {items.map((item, index) => (
          <Chip key={index} label={item} size="small" sx={{ margin: '2px' }} />
        ))}
      </Stack>
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEdit = (pacote: PacoteUniforme) => {
    setEditData(pacote);
    setOpenEditModal(true);
  };

  const handleSave = async () => {
    if (!editData) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/produto/pacote/uniforme/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editData),
      });
  
      if (response.ok) {
        alert("Pacote atualizado com sucesso!");
        setOpenEditModal(false);
      } else {
        alert("Erro ao atualizar pacote.");
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      alert("Erro ao salvar edição.");
    }
  };

  return (
    <PageContainer title="Produtos / Pacotes de Uniformes" description="Pacotes de Uniformes da Arte Arena">
      <Breadcrumb title="Produtos / Pacotes de Uniformes" subtitle="Gerencie Produtos da Arte Arena / Pacotes de Uniformes" />
      <ParentCard title="Pacotes de Uniformes">
        <>
          <Stack direction="row" spacing={1} sx={{ marginBottom: '1em', height: '3em', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<IconPlus />} sx={{ height: '100%' }}>
              Adicionar Novo Pacote
            </Button>
          </Stack>

          {isLoadingPacotesUniforme ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {pacotesUniforme?.map((pacote) => (
                <Grid item xs={12} sm={6} md={4} key={pacote.id}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {pacote.nome}
                      </Typography>

                      <List dense={true}>
                        <ListItem>
                          <ListItemText
                            primary="Tecido"
                            secondary={`Camisa: ${pacote.tipo_de_tecido_camisa} | Calção: ${pacote.tipo_de_tecido_calcao}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tipo de Gola"
                            secondary={Array.isArray(pacote.tipo_gola) ? pacote.tipo_gola.join(", ") : pacote.tipo_gola}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tamanhos"
                            secondary={Array.isArray(pacote.tamanhos_permitidos) ? pacote.tamanhos_permitidos.join(", ") : "Não especificado"}
                          />
                        </ListItem>
                      </List>

                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpenModal(pacote)}
                        sx={{ mt: 2 }}
                      >
                        Ver detalhes completos
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Modal de Detalhes */}
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
          >
            {selectedPacote && (
              <>
                <DialogTitle>
                  <Typography variant="h4">{selectedPacote.nome}</Typography>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 1 }}>Informações da Camisa</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tecido:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.tipo_de_tecido_camisa}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Fator de Proteção UV:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.numero_fator_protecao_uv_camisa || "Não especificado"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tipos de Gola:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {renderArrayItems(selectedPacote.tipo_gola)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Gola Customizada:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.permite_gola_customizada ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tipos de Escudo:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {renderArrayItems(selectedPacote.tipo_de_escudo_na_camisa)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Informações do Calção</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tecido:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.tipo_de_tecido_calcao}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Fator de Proteção UV:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.numero_fator_protecao_uv_calcao || "Não especificado"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tipos de Escudo:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {renderArrayItems(selectedPacote.tipo_de_escudo_no_calcao)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Informações do Meião</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Tecido:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.tipo_de_tecido_meiao || "Não especificado"}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Recursos Adicionais</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Permite Nome de Jogador:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.permite_nome_de_jogador ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Permite Escudo:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.permite_escudo ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Patrocínio:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedPacote.patrocinio_ilimitado ? "Ilimitado" : `Máximo de ${selectedPacote.patrocinio_numero_maximo || 0}`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Punho Personalizado:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.punho_personalizado ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Etiqueta de Produto Autêntico:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.etiqueta_de_produto_autentico ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Logo Totem em Patch 3D:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.logo_totem_em_patch_3d ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Selo de Produto Oficial:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.selo_de_produto_oficial ? "Sim" : "Não"}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Selo de Proteção UV:</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedPacote.selo_de_protecao_uv ? "Sim" : "Não"}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Tamanhos Permitidos</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        {renderArrayItems(selectedPacote.tamanhos_permitidos)}
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(selectedPacote)}>
                    Editar
                  </Button>
                  <Button onClick={handleCloseModal}>Fechar</Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
            {editData && (
              <>
                <DialogTitle>Editar Pacote</DialogTitle>
                <DialogContent>
                  <CustomTextField
                    fullWidth
                    label="Nome"
                    value={editData.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, nome: e.target.value })}
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Tecido Camisa"
                    value={editData.tipo_de_tecido_camisa}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_de_tecido_camisa: e.target.value })}
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Tecido Calção"
                    value={editData.tipo_de_tecido_calcao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_de_tecido_calcao: e.target.value })}
                    margin="dense"
                  />
                  <CustomCheckbox
                    // label="Permite Gola Customizada"
                    checked={editData.permite_gola_customizada}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, permite_gola_customizada: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Gola"
                    value={editData.tipo_gola.join(', ')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_gola: e.target.value.split(', ') })}
                    margin="dense"
                  />
                  <CustomCheckbox
                    // label="Permite Nome de Jogador"
                    checked={editData.permite_nome_de_jogador}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, permite_nome_de_jogador: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomCheckbox
                    // label="Permite Escudo"
                    checked={editData.permite_escudo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, permite_escudo: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Escudo na Camisa"
                    value={editData.tipo_de_escudo_na_camisa.join(', ')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_de_escudo_na_camisa: e.target.value.split(', ') })}
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Escudo no Calção"
                    value={editData.tipo_de_escudo_no_calcao.join(', ')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_de_escudo_no_calcao: e.target.value.split(', ') })}
                    margin="dense"
                  />
                  <CustomCheckbox
                    // label="Patroc nio Ilimitado"
                    checked={editData.patrocinio_ilimitado}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, patrocinio_ilimitado: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tamanhos Permitidos"
                    value={editData.tamanhos_permitidos.join(', ')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tamanhos_permitidos: e.target.value.split(', ') })}
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="N mero de Fator de Prote o UV da Camisa"
                    value={editData.numero_fator_protecao_uv_camisa}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, numero_fator_protecao_uv_camisa: Number(e.target.value) })}
                    type="number"
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="N mero de Fator de Prote o UV do Cal a o"
                    value={editData.numero_fator_protecao_uv_calcao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, numero_fator_protecao_uv_calcao: Number(e.target.value) })}
                    type="number"
                    margin="dense"
                  />
                  <CustomTextField
                    fullWidth
                    label="Tipo de Tecido do Meio"
                    value={editData.tipo_de_tecido_meiao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, tipo_de_tecido_meiao: e.target.value })}
                    margin="dense"
                  />
                  <CustomCheckbox
                    // label="Punho Personalizado"
                    checked={editData.punho_personalizado}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, punho_personalizado: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomCheckbox
                    // label="Etiqueta de Produto Aut n tico"
                    checked={editData.etiqueta_de_produto_autentico}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, etiqueta_de_produto_autentico: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomCheckbox
                    // label="Logo Totem em Patch 3D"
                    checked={editData.logo_totem_em_patch_3d}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, logo_totem_em_patch_3d: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomCheckbox
                    // label="Selo de Produto Oficial"
                    checked={editData.selo_de_produto_oficial}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, selo_de_produto_oficial: e.target.checked })}
                    // margin="dense"
                  />
                  <CustomCheckbox
                    // label="Selo de Prote o UV"
                    checked={editData.selo_de_protecao_uv}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, selo_de_protecao_uv: e.target.checked })}
                    // margin="dense"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Salvar
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

        </>
      </ParentCard>
    </PageContainer>
  );
};

export default ProdutosPacotesUniformesScreen;