'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField, Snackbar, InputAdornment, Stepper, Step, StepLabel, Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import * as Yup from 'yup';
import { ProdutoFormValues } from '../../produtos/components/types';

const ProdutoForm = () => {
  const router = useRouter();
  const params = useParams();
  const isEditing = Boolean(params?.id);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState<ProdutoFormValues>({
    produto_id: '', produto_nome: '', produto_codigo: '', produto_preco: '', produto_preco_promocional: '', produto_preco_custo: '', produto_preco_custo_medio: '', produto_peso_liquido: '', produto_peso_bruto: '', produto_tipoEmbalagem: '', produto_alturaEmbalagem: '', produto_comprimentoEmbalagem: '', produto_larguraEmbalagem: '', produto_diametroEmbalagem: '', produto_unidade: '', produto_gtin: '', produto_gtin_embalagem: '', produto_localizacao: '', produto_situacao: '', produto_tipo: '', produto_tipo_variacao: '', produto_ncm: '', produto_origem: '', produto_estoque_minimo: '', produto_estoque_maximo: '', produto_id_fornecedor: '', produto_nome_fornecedor: '', produto_codigo_fornecedor: '', produto_codigo_pelo_fornecedor: '', produto_unidade_por_caixa: '', produto_classe_ipi: '', produto_valor_ipi_fixo: '', produto_cod_lista_servicos: '', produto_descricao_complementar: '', produto_garantia: '', produto_cest: '', produto_obs: '', produto_variacoes: '', produto_idProdutoPai: '', produto_sob_encomenda: '', produto_dias_preparacao: '', produto_marca: '', produto_qtd_volumes: '', produto_categoria: '', produto_anexos: '', produto_imagens_externas: '', produto_classe_produto: '', produto_seo_title: '', produto_seo_keywords: '', produto_link_video: '', produto_seo_description: '', produto_slug: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProdutoFormValues, string>>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const schema = Yup.object({
    produto_nome: Yup.string().required('Nome é obrigatório'),
    produto_codigo: Yup.string().required('Código é obrigatório'),
    produto_preco: Yup.number().required('Preço é obrigatório')
  });

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const showSnackbar = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  useEffect(() => {
    console.log("Campos desta seção:", sections[activeStep].fields);
  }, [activeStep]);

  useEffect(() => {
    const fetchProduto = async () => {
      if (isEditing) {
        try {
          const { data } = await axios.get(`/api/produtos/${params.id}`);
          setFormValues({ ...formValues, ...data.produto, produto_id: data.produto.id });
        } catch (error) {
          console.error(error);
          showSnackbar('Erro ao carregar produto.', 'error');
        }
      }
    };
    fetchProduto();
  }, [isEditing, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schema.validate(formValues, { abortEarly: false });
      setErrors({});
      setLoading(true);
      await axios.post('/api/produtos/upsert', formValues);
      showSnackbar('Produto salvo com sucesso!', 'success');
      setTimeout(() => router.push('/produtos'), 1500);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const formErrors: Partial<Record<keyof ProdutoFormValues, string>> = {};
        err.inner.forEach((validationError: any) => {
          formErrors[validationError.path as keyof ProdutoFormValues] = validationError.message;
        });
        setErrors(formErrors);
        showSnackbar('Preencha todos os campos obrigatórios.', 'error');
      } else {
        console.error(err);
        showSnackbar('Erro ao salvar produto.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (field: string) =>
    field.replace('produto_', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const sections = [
    { title: '📦 Informações Básicas', fields: ['produto_nome', 'produto_codigo', 'produto_preco', 'produto_tipo', 'produto_categoria', 'produto_marca', 'produto_localizacao', 'produto_situacao'] },
    { title: '🏷️ Fornecedor', fields: ['produto_id_fornecedor', 'produto_nome_fornecedor', 'produto_codigo_fornecedor', 'produto_codigo_pelo_fornecedor', 'produto_unidade_por_caixa'] },
    { title: '📦 Embalagem', fields: ['produto_tipoEmbalagem', 'produto_alturaEmbalagem', 'produto_comprimentoEmbalagem', 'produto_larguraEmbalagem', 'produto_diametroEmbalagem', 'produto_gtin_embalagem'] },
    { title: '🔢 Estoque', fields: ['produto_estoque_minimo', 'produto_estoque_maximo', 'produto_peso_liquido', 'produto_peso_bruto', 'produto_gtin'] },
    { title: '⚙️ Definições Técnicas', fields: ['produto_ncm', 'produto_origem', 'produto_classe_ipi', 'produto_valor_ipi_fixo', 'produto_cod_lista_servicos', 'produto_cest'] },
    { title: '🌎 SEO e Mídia', fields: ['produto_seo_title', 'produto_seo_keywords', 'produto_seo_description', 'produto_slug', 'produto_link_video', 'produto_anexos', 'produto_imagens_externas'] },
    { title: '🧩 Outras Informações', fields: ['produto_variacoes', 'produto_tipo_variacao', 'produto_idProdutoPai', 'produto_sob_encomenda', 'produto_dias_preparacao', 'produto_obs', 'produto_descricao_complementar', 'produto_garantia', 'produto_classe_produto', 'produto_qtd_volumes'] }
  ];

  const renderInput = (name: keyof ProdutoFormValues, label: string, type: string = 'text') => {
    console.log("Rendering", name, "with value", formValues[name]);
    const isPreco = ['produto_preco', 'produto_preco_promocional', 'produto_preco_custo', 'produto_preco_custo_medio', 'produto_valor_ipi_fixo'].includes(name);

    const value = formValues[name];
    const safeValue = isPreco ? (value !== '' ? Number(value) : '') : value;

    return (
      <Grid item xs={12} sm={6} md={4} key={name}>
        <TextField
          fullWidth
          name={name}
          label={label}
          type={isPreco ? 'number' : type}
          value={safeValue}
          onChange={handleChange}
          error={Boolean(errors[name])}
          helperText={errors[name]}
          InputProps={isPreco ? {
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            inputProps: { step: "0.01", min: 0 }
          } : undefined}
        />
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, margin: '0 auto' }}>
      <Typography variant="h4" mb={3}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {sections.map(section => (
          <Step key={section.title}><StepLabel>{section.title}</StepLabel></Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{sections[activeStep].title}</Typography>
            <Grid container spacing={2}>
              {sections[activeStep].fields.map(field => {
                console.log('mapeando field:', field)
                return renderInput(
                  field as keyof ProdutoFormValues,
                  formatLabel(field)
                )
              })}
              {/* {sections[activeStep].fields.map(field => renderInput(field as keyof ProdutoFormValues, formatLabel(field)))} */}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Anterior</Button>
          {activeStep === sections.length - 1 ? (
            <LoadingButton type="submit" variant="contained" loading={loading} startIcon={<Save />}>{isEditing ? 'Atualizar Produto' : 'Salvar Produto'}</LoadingButton>
          ) : (
            <Button variant="contained" onClick={() => setActiveStep(prev => prev + 1)}>Próximo</Button>
          )}
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', backgroundColor: snackbar.severity === 'success' ? 'rgba(46,125,50,0.9)' : 'rgba(211,47,47,0.9)' } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={false}
          sx={{ width: '100%', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500, color: 'common.white', '& .MuiAlert-message': { display: 'flex', alignItems: 'center', gap: 1 } }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProdutoForm;