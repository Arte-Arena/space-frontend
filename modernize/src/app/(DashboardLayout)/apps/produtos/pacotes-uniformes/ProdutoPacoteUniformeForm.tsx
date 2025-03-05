import { useState, useEffect } from "react";
import ProdutoPacoteUniforme from './types';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';

import { Box, Button, FormControlLabel, FormControl, InputLabel, OutlinedInput, MenuItem, ListItemText, SelectChangeEvent } from '@mui/material';

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

  const tiposTecidoCamisaDisponiveis = ["Dryfit Liso", "Dryfit Sport Star Liso", "DryFit Camb Pro"];
  const tiposTecidoCalcaoDisponiveis = ["Dryfit Liso", "Dryfit Sport Star Liso", "DryFit Camb Pro"];
  const tiposGolaDisponiveis = ["Polo", "Careca", "V", "Bayard"];
  const tiposEscudoCamisaDisponiveis = ["Sublimado", "Patch 3D"];
  const tiposEscudoCalcaoDisponiveis = ["Sublimado", "Patch 3D"];
  const tamanhosDisponiveis = ["PP", "P", "M", "G", "GG", "XG", "XXG", "XXXG"];
  const tiposTecidoMeiaoDisponiveis = ["Helanca Profissional", "Helanca Profissional Premium"];

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleMultiSelectChange = (field: string, value: string) => {
    if (readOnly) return;
    setFormData((prev) => {
      const updatedArray = Array.isArray(prev[field as keyof ProdutoPacoteUniforme]) ? prev[field as keyof ProdutoPacoteUniforme] as string[] : [];
      return {
        ...prev,
        [field]: updatedArray.includes(value)
          ? updatedArray.filter((item) => item !== value)
          : [...updatedArray, value],
      };
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, field: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log('enviado');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">

      <Box sx={{ mt: 5 }}>
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
      </Box>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo_de_tecido_camisa">Tipo de Tecido da Camisa</InputLabel>
        <CustomSelect
          labelId="tipo_tecido_camisa"
          id="tipo_de_tecido_camisa_select"
          value={formData.tipo_de_tecido_camisa}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, "tipo_de_tecido_camisa")}
          input={<OutlinedInput label="Tipo de Tecido da Camisa" />}
          renderValue={(selected: string) => selected}
        >
          {tiposTecidoCamisaDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo} disabled={readOnly}>
              {tipo}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo_de_tecido_camisa">Tipo de Tecido do Calção</InputLabel>
        <CustomSelect
          labelId="tipo_tecido_calcao"
          id="tipo_de_tecido_calcao_select"
          value={formData.tipo_de_tecido_calcao}
          onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, "tipo_de_tecido_calcao")}
          input={<OutlinedInput label="Tipo de Tecido do Calção" />}
          renderValue={(selected: string) => selected}
        >
          {tiposTecidoCalcaoDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo} disabled={readOnly}>
              {tipo}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5 }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.permite_gola_customizada}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, permite_gola_customizada: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Gola Customizada"
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
                checked={formData.tipo_gola.includes(tipo)}
                onChange={() => handleMultiSelectChange("tipo_gola", tipo)}
                disabled={readOnly}
              />
              <ListItemText primary={tipo} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.permite_nome_de_jogador}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, permite_nome_de_jogador: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Nome de Jogador"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.permite_escudo}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, permite_escudo: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Escudo"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo-escudo-camisa">Tipo de Escudo da Camisa</InputLabel>
        <CustomSelect
          labelId="tipo-escudo-camisa"
          id="tipo-escudo-camisa"
          value={formData.tipo_de_escudo_na_camisa}
          onChange={(e: SelectChangeEvent<string[]>) => handleMultiSelectChange("tipo_de_escudo_na_camisa", e.target.value as string)}
          input={<OutlinedInput label="Tipo de Escudo da Camisa" />}
          renderValue={(selected: string[]) => selected.join(', ')}
        >
          {tiposEscudoCamisaDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo} disabled={readOnly}>
              {tipo}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo_de_escudo_no_calcao">Tipo de Escudo do Calção</InputLabel>
        <CustomSelect
          labelId="tipo-escudo-calcao"
          id="tipo_de_escudo_no_calcao"
          value={formData.tipo_de_escudo_no_calcao}
          onChange={(e: SelectChangeEvent<string[]>) => handleMultiSelectChange("tipo_de_escudo_no_calcao", e.target.value as string)}
          input={<OutlinedInput label="Tipo de Escudo do Calção" />}
          renderValue={(selected: string[]) => selected.join(', ')}
        >
          {tiposEscudoCalcaoDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo} disabled={readOnly}>
              {tipo}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.patrocinio_ilimitado}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, patrocinio_ilimitado: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Patrocínios Ilimitados"
        />
      </FormControl>

      <CustomTextField
        label="Número Máximo de Patrocínios"
        name="patrocinio_numero_maximo"
        value={formData.patrocinio_numero_maximo}
        onChange={handleChange}
        placeholder="Número Máximo de Patrocínios"
        variant="outlined"
        fullWidth
        readOnly={readOnly}
      />

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tamanhos_permitidos">Tamanhos</InputLabel>
        <CustomSelect
          labelId="tamanhos_permitidos_label"
          id="tamanhos_permitidos_id"
          multiple
          value={formData.tamanhos_permitidos}
          input={<OutlinedInput label="Tipo de Gola" />}
          renderValue={(selected: string[]) => selected.join(', ')}
        >
          {tamanhosDisponiveis.map((tamanhos) => (
            <MenuItem key={tamanhos} value={tamanhos} disabled={readOnly}>
              <CustomCheckbox
                checked={formData.tamanhos_permitidos.includes(tamanhos)}
                onChange={() => handleMultiSelectChange("tamanhos_permitidos", tamanhos)}
                disabled={readOnly}
              />
              <ListItemText primary={tamanhos} />
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <CustomFormLabel
        sx={{
          mt: 5,
        }}
        htmlFor="numero_fator_protecao_uv_camisa"
      >
        Fator Proteção UV Camisa
      </CustomFormLabel>
      <CustomTextField
        label="Fator Proteção UV Camisa"
        name="numero_fator_protecao_uv_camisa"
        value={formData.numero_fator_protecao_uv_camisa}
        onChange={handleChange}
        placeholder="Fator Proteção UV Camisa"
        variant="outlined"
        fullWidth
        readOnly={readOnly}
      />

      <CustomFormLabel
        sx={{
          mt: 5,
        }}
        htmlFor="numero_fator_protecao_uv_calcao"
      >
        Fator Proteção UV Calção
      </CustomFormLabel>
      <CustomTextField
        label="Fator Proteção UV Calção"
        name="numero_fator_protecao_uv_calcao"
        value={formData.numero_fator_protecao_uv_calcao}
        onChange={handleChange}
        placeholder="Fator Proteção UV Calção"
        variant="outlined"
        fullWidth
        readOnly={readOnly}
      />

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <InputLabel id="tipo_de_tecido_meiao">Tipo de Tecido do Meião</InputLabel>
        <CustomSelect
          labelId="tipo_de_tecido_meiao-label"
          id="tipo_de_tecido_meiao"
          value={formData.tipo_de_tecido_meiao}
          onChange={readOnly ? undefined : (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, tipo_de_tecido_meiao: e.target.value }))}
          input={<OutlinedInput label="Tipo de Escudo do Calção" />}
          renderValue={(selected: string) => selected}
        >
          {tiposTecidoMeiaoDisponiveis.map((tipo) => (
            <MenuItem key={tipo} value={tipo} disabled={readOnly}>
              {tipo}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.punho_personalizado}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, punho_personalizado: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Punho Personalizado"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.etiqueta_de_produto_autentico}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, etiqueta_de_produto_autentico: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Etiqueta de Produto Autêntico"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.logo_totem_em_patch_3d}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, logo_totem_em_patch_3d: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Logo Totem em Patch 3D"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.selo_de_produto_oficial}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, selo_de_produto_oficial: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Selo de Produto Oficial"
        />
      </FormControl>

      <FormControl sx={{ mt: 5, width: '100%' }}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={formData.selo_de_protecao_uv}
              onChange={readOnly ? undefined : (e) => setFormData(prev => ({ ...prev, selo_de_protecao_uv: e.target.checked }))}
              disabled={readOnly}
            />
          }
          label="Selo de Proteção UV"
        />
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
