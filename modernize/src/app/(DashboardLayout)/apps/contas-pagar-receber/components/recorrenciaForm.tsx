'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  FormHelperText,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  Box, // Adicionado para espaçamento
} from '@mui/material';

// Importando os tipos definidos acima (ou defina-os no mesmo arquivo se preferir)
export type TipoRecorrencia = 'diaria' | 'semanal' | 'mensal' | 'anual' | 'personalizada';
export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom' | '';
export type StatusRecorrencia = 'ativa' | 'pausada';

export interface RecorrenciaFormData {
  conta_id: number | string | null | undefined;
  tipo_recorrencia: TipoRecorrencia;
  intervalo: number | string;
  dia_mes?: number | string;
  dia_semana?: DiaSemana;
  data_inicio: string;
  data_fim?: string;
  max_ocorrencias?: number | string;
  valor?: number | string;
  status: StatusRecorrencia;
}

export interface RecorrenciaFormErrors {
  conta_id?: string;
  tipo_recorrencia?: string;
  intervalo?: string;
  dia_mes?: string;
  dia_semana?: string;
  data_inicio?: string;
  data_fim?: string;
  max_ocorrencias?: string;
  valor?: string;
  status?: string;
}

export interface RecorrenciaFormDialogProps {
  open: boolean;
  onClose: () => void;
  contaId: number | string | null | undefined;
  onSave?: (formData: RecorrenciaFormData) => void;
}

const RecorrenciaFormDialog: React.FC<RecorrenciaFormDialogProps> = ({
  open,
  onClose,
  contaId,
  onSave,
}) => {
  const initialState: RecorrenciaFormData = {
    conta_id: contaId,
    tipo_recorrencia: 'mensal',
    intervalo: 1,
    dia_mes: new Date().getDate().toString(), // Convertido para string para o TextField
    dia_semana: 'seg',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: '',
    max_ocorrencias: '',
    valor: '',
    status: 'ativa',
  };

  const [formData, setFormData] = useState<RecorrenciaFormData>(initialState);
  const [errors, setErrors] = useState<RecorrenciaFormErrors>({});

  // Atualiza o conta_id no formData se o prop contaId mudar
  useEffect(() => {
    setFormData(prev => ({ ...prev, conta_id: contaId }));
  }, [contaId]);


  // Limpa campos não relevantes quando o tipo de recorrência muda
  useEffect(() => {
    setFormData(prevData => {
      const newData: RecorrenciaFormData = { ...prevData };
      if (!['mensal', 'bimestral', 'trimestral', 'semestral'].includes(prevData.tipo_recorrencia)) {
        newData.dia_mes = '';
      }
      if (prevData.tipo_recorrencia !== 'semanal') {
        newData.dia_semana = '';
      }
      return newData;
    });
  }, [formData.tipo_recorrencia]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'ativa' : 'pausada',
    }));
  };

  const validate = (): boolean => {
    const newErrors: RecorrenciaFormErrors = {};

    if (!formData.data_inicio) {
      newErrors.data_inicio = 'Data inicial é obrigatória.';
    } else if (formData.data_fim && formData.data_fim < formData.data_inicio) {
      newErrors.data_fim = 'Data final não pode ser anterior à data inicial.';
    }

    if (formData.tipo_recorrencia === 'mensal') {
      if (!formData.dia_mes) {
        newErrors.dia_mes = 'Dia do mês é obrigatório para recorrência mensal.';
      } else {
        const diaMesNum = parseInt(String(formData.dia_mes), 10);
        if (isNaN(diaMesNum) || diaMesNum < 1 || diaMesNum > 31) {
          newErrors.dia_mes = 'Dia do mês deve ser entre 1 e 31.';
        }
      }
    }

    if (formData.tipo_recorrencia === 'semanal' && !formData.dia_semana) {
      newErrors.dia_semana = 'Dia da semana é obrigatório para recorrência semanal.';
    }

    if (formData.intervalo === '' || parseInt(String(formData.intervalo), 10) < 1) {
      newErrors.intervalo = 'Intervalo deve ser 1 ou maior.';
    }

    if (formData.max_ocorrencias && parseInt(String(formData.max_ocorrencias), 10) < 1) {
      newErrors.max_ocorrencias = 'Nº de ocorrências deve ser 1 ou maior, se informado.';
    }

    if (formData.valor && parseFloat(String(formData.valor)) < 0) {
      newErrors.valor = 'Valor não pode ser negativo.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Converte campos numéricos de string para número antes de salvar
      const dataToSave: RecorrenciaFormData = {
        ...formData,
        intervalo: parseInt(String(formData.intervalo), 10),
        dia_mes: formData.dia_mes ? parseInt(String(formData.dia_mes), 10) : undefined,
        max_ocorrencias: formData.max_ocorrencias ? parseInt(String(formData.max_ocorrencias), 10) : undefined,
        valor: formData.valor ? parseFloat(String(formData.valor)) : undefined,
      };
      if (onSave) {
        onSave(dataToSave);
      }
      onClose(); // Fecha o diálogo após salvar
      setFormData(initialState); // Reseta o formulário para o estado inicial
      setErrors({}); // Limpa os erros
    }
  };

  // Reseta o formulário quando o diálogo é fechado ou o estado inicial muda
  useEffect(() => {
    if (open) {
      setFormData({
        ...initialState,
        conta_id: contaId, // Garante que o contaId está atualizado ao abrir
      });
      setErrors({});
    }
  }, [open, contaId]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar Recorrência</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.tipo_recorrencia}>
                <InputLabel id="tipo-recorrencia-label">Tipo de Recorrência</InputLabel>
                <Select
                  labelId="tipo-recorrencia-label"
                  name="tipo_recorrencia"
                  value={formData.tipo_recorrencia}
                  onChange={handleChange}
                  label="Tipo de Recorrência"
                >
                  <MenuItem value="diaria">Diária</MenuItem>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="quinzenal">Quinzenal</MenuItem>
                  <MenuItem value="mensal">Mensal</MenuItem>
                  <MenuItem value="bimestral">Bimestral</MenuItem>
                  <MenuItem value="trimestral">Trimestral</MenuItem>
                  <MenuItem value="semestral">Semestral</MenuItem>
                  <MenuItem value="anual">Anual</MenuItem>
                  <MenuItem value="personalizada">Personalizada</MenuItem>
                </Select>
                {errors.tipo_recorrencia && <FormHelperText>{errors.tipo_recorrencia}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="intervalo"
                label="Intervalo"
                value={formData.intervalo}
                onChange={handleChange}
                error={!!errors.intervalo}
                helperText={errors.intervalo || (formData.tipo_recorrencia === 'diaria' ? 'Ex: 2 = A cada 2 dias' :
                  formData.tipo_recorrencia === 'semanal' ? 'Ex: 1 = Toda semana' :
                    formData.tipo_recorrencia === 'mensal' ? 'Ex: 3 = A cada 3 meses' :
                      formData.tipo_recorrencia === 'anual' ? 'Ex: 1 = Todo ano' : 'Número de períodos')}
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Dia do mês (mensal, bimestral, trimestral, semestral) */}
            {['mensal', 'bimestral', 'trimestral', 'semestral'].includes(formData.tipo_recorrencia) && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="dia_mes"
                  label="Dia do Mês"
                  value={formData.dia_mes}
                  onChange={handleChange}
                  error={!!errors.dia_mes}
                  helperText={errors.dia_mes || '1-31'}
                  inputProps={{ min: 1, max: 31 }}
                />
              </Grid>
            )}

            {/* Dia da semana (semanal, quinzenal) */}
            {['semanal', 'quinzenal'].includes(formData.tipo_recorrencia) && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.dia_semana}>
                  <InputLabel id="dia-semana-label">Dia da Semana</InputLabel>
                  <Select
                    labelId="dia-semana-label"
                    name="dia_semana"
                    value={formData.dia_semana}
                    onChange={handleChange}
                    label="Dia da Semana"
                  >
                    <MenuItem value="seg">Segunda-feira</MenuItem>
                    <MenuItem value="ter">Terça-feira</MenuItem>
                    <MenuItem value="qua">Quarta-feira</MenuItem>
                    <MenuItem value="qui">Quinta-feira</MenuItem>
                    <MenuItem value="sex">Sexta-feira</MenuItem>
                    <MenuItem value="sab">Sábado</MenuItem>
                    <MenuItem value="dom">Domingo</MenuItem>
                  </Select>
                  {errors.dia_semana && <FormHelperText>{errors.dia_semana}</FormHelperText>}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="data_inicio"
                label="Data Inicial"
                value={formData.data_inicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.data_inicio}
                helperText={errors.data_inicio}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="data_fim"
                label="Data Final"
                value={formData.data_fim}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.data_fim}
                helperText={errors.data_fim || "Opcional. Deixe em branco para recorrência sem data final."}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="max_ocorrencias"
                label="Nº Máx. de Ocorrências"
                value={formData.max_ocorrencias}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                error={!!errors.max_ocorrencias}
                helperText={errors.max_ocorrencias || "Opcional. Deixe em branco para ilimitado."}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="valor"
                label="Valor da Recorrência"
                value={formData.valor}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0 }}
                error={!!errors.valor}
                helperText={errors.valor || "Opcional. Se em branco, usa o valor da conta original."}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formData.status === 'ativa'}
                    onChange={handleSwitchChange} // Usando handleSwitchChange
                  />
                }
                label={formData.status === 'ativa' ? "Recorrência Ativa" : "Recorrência Pausada"}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={() => { onClose(); setFormData(initialState); setErrors({}); }} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar Recorrência
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecorrenciaFormDialog;