import { useState, useEffect } from "react";
import ProdutoPacoteUniforme from './types';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';

import { Box, Button, FormControlLabel, FormControl, InputLabel, OutlinedInput, MenuItem, ListItemText } from '@mui/material';

interface ProdutoPacoteUniformeFormProps {
  initialData?: ProdutoPacoteUniforme;
  onSubmit?: (data: ProdutoPacoteUniforme) => void;
  readOnly?: boolean;
}

export default function ProdutoPacoteUniformeForm({ initialData, onSubmit, readOnly = false }: ProdutoPacoteUniformeFormProps) {
  const [formData, setFormData] = useState<ProdutoPacoteUniforme>({
    id: undefined,
    nome: "",
    tipo_de_tecido_camisa: "",
    tipo_de_tecido_calcao: "",
    permite_gola_customizada: false,
    tipo_gola: [],
    permite_nome_de_jogador: false,
    permite_escudo: false,
    tipo_de_escudo_na_camisa: [],
    tipo_de_escudo_no_calcao: [],
    patrocinio_ilimitado: false,
    patrocinio_numero_maximo: null,
    tamanhos_permitidos: [],
    numero_fator_protecao_uv_camisa: 0,
    numero_fator_protecao_uv_calcao: 0,
    tipo_de_tecido_meiao: "",
    punho_personalizado: false,
    etiqueta_de_produto_autentico: false,
    logo_totem_em_patch_3d: false,
    selo_de_produto_oficial: false,
    selo_de_protecao_uv: false,
    created_at: "",
    updated_at: "",
  });

  const tiposGolaDisponiveis = ["Polo", "Careca", "V", "Bayard"];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleTipoGolaChange(tipo: string) {
    if (readOnly) return;
    const tipoGolaAtual = formData.tipo_gola;
    const indice = tipoGolaAtual.indexOf(tipo);
    if (indice > -1) {
      setFormData((prev) => ({ ...prev, tipo_gola: tipoGolaAtual.filter((t) => t !== tipo) }));
    } else {
      setFormData((prev) => ({ ...prev, tipo_gola: [...tipoGolaAtual, tipo] }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log('enviado');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">
      <CustomFormLabel
        sx={{
          mt: 5,
        }}
        htmlFor="nome"
      >
        Nome do Pacote de Uniformes
      </CustomFormLabel>
      <CustomTextField
        label="Nome do produto"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Nome do produto"
        variant="outlined"
        fullWidth
        readOnly={readOnly}
      />
      <CustomFormLabel
        sx={{
          mt: 5,
        }}
        htmlFor="tipo_de_tecido_camisa"
      >
        Tipo de Tecido da Camisa
      </CustomFormLabel>
      <CustomTextField
        label="Tecido da camisa"
        name="tipo_de_tecido_camisa"
        value={formData.tipo_de_tecido_camisa}
        onChange={handleChange}
        placeholder="Tecido da camisa"
        variant="outlined"
        fullWidth
        readOnly={readOnly}
      />


      <CustomFormLabel
        sx={{
          mt: 5,
        }}
        htmlFor="tipo_de_tecido_calcao"
      >
        Tipo de Tecido da Calção
      </CustomFormLabel>
      <CustomTextField
        label="Tecido da calção"
        name="tipo_de_tecido_calcao"
        value={formData.tipo_de_tecido_calcao}
        onChange={handleChange}
        placeholder="Tecido da calção"
        variant="outlined"
        fullWidth
        rows={4}
        readOnly={readOnly}
      />

      <FormControl sx={{ mt: 5 }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.permite_gola_customizada}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, permite_gola_customizada: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Permite Gola Customizada"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo-gola-label">Tipo de Gola</InputLabel>
        <CustomSelect
          labelId="tipo-gola-label"
          id="tipo-gola"
          multiple
          value={formData.tipo_gola}
          input={<OutlinedInput label="Tipo de Gola" />}
          renderValue={(selected: string[]) => selected.join(', ')}
        >
          {tiposGolaDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              <CustomCheckbox
                checked={formData.tipo_gola.indexOf(tipo) > -1}
                onChange={(e) => handleTipoGolaChange(tipo)}
                disabled={readOnly}
              />
              <ListItemText primary={tipo} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      {!readOnly && (
        <Box sx={{ mt: 5 }}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </Box>
      )}
    </form>
  );
}
