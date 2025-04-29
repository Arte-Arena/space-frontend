
'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Snackbar,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import * as Yup from 'yup';
import { ProdutoFormValues } from '../../produtos/components/types';

export default function ProdutoForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = Boolean(params?.id);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeStep, setActiveStep] = useState(0);
  const [initialValues, setInitialValues] = useState<ProdutoFormValues>({
    produto_id: '',
    produto_nome: '',
    produto_codigo: '',
    produto_preco: '',
    produto_preco_promocional: '',
    produto_preco_custo: '',
    produto_preco_custo_medio: '',
    produto_peso_liquido: '',
    produto_peso_bruto: '',
    produto_tipo_Embalagem: '',
    produto_altura_Embalagem: '',
    produto_comprimento_Embalagem: '',
    produto_largura_Embalagem: '',
    produto_diametro_Embalagem: '',
    produto_unidade: '',
    produto_gtin: '',
    produto_gtin_embalagem: '',
    produto_localizacao: '',
    produto_situacao: '',
    produto_tipo: '',
    produto_tipo_variacao: '',
    produto_ncm: '',
    produto_origem: '',
    produto_estoque_minimo: '',
    produto_estoque_maximo: '',
    produto_id_fornecedor: '',
    produto_nome_fornecedor: '',
    produto_codigo_fornecedor: '',
    produto_codigo_pelo_fornecedor: '',
    produto_unidade_por_caixa: '',
    produto_classe_ipi: '',
    produto_valor_ipi_fixo: '',
    produto_cod_lista_servicos: '',
    produto_descricao_complementar: '',
    produto_garantia: '',
    produto_cest: '',
    produto_obs: '',
    produto_variacoes: '',
    produto_id_Produto_Pai: '',
    produto_sob_encomenda: '',
    produto_dias_preparacao: '',
    produto_marca: '',
    produto_qtd_volumes: '',
    produto_categoria: '',
    produto_anexos: '',
    produto_imagens_externas: '',
    produto_classe_produto: '',
    produto_seo_title: '',
    produto_seo_keywords: '',
    produto_link_video: '',
    produto_seo_description: '',
    produto_slug: ''
  });

  const precoFields: (keyof ProdutoFormValues)[] = [
    'produto_preco',
    'produto_preco_promocional',
    'produto_preco_custo',
    'produto_preco_custo_medio',
    'produto_valor_ipi_fixo'
  ];

  const sections = [
    { title: '📦 Informações Básicas', fields: ['produto_nome','produto_codigo','produto_preco','produto_tipo','produto_categoria','produto_marca','produto_localizacao','produto_situacao'] },
    { title: '💰 Valores', fields: ['produto_preco_promocional','produto_preco_custo','produto_preco_custo_medio','produto_valor_ipi_fixo'] },
    { title: '🏷️ Fornecedor', fields: ['produto_id_fornecedor','produto_nome_fornecedor','produto_codigo_fornecedor','produto_codigo_pelo_fornecedor','produto_unidade_por_caixa'] },
    { title: '📦 Embalagem', fields: ['produto_tipo_Embalagem','produto_altura_Embalagem','produto_comprimento_Embalagem','produto_largura_Embalagem','produto_diametro_Embalagem','produto_gtin_embalagem'] },
    { title: '🔢 Estoque', fields: ['produto_estoque_minimo','produto_estoque_maximo','produto_peso_liquido','produto_peso_bruto','produto_gtin'] },
    { title: '⚙️ Definições Técnicas', fields: ['produto_ncm','produto_origem','produto_classe_ipi','produto_valor_ipi_fixo','produto_cod_lista_servicos','produto_cest'] },
    { title: '🌎 SEO e Mídia', fields: ['produto_seo_title','produto_seo_keywords','produto_seo_description','produto_slug','produto_link_video','produto_anexos','produto_imagens_externas'] },
    { title: '🧩 Outras Informações', fields: ['produto_variacoes','produto_tipo_variacao','produto_id_Produto_Pai','produto_sob_encomenda','produto_dias_preparacao','produto_obs','produto_descricao_complementar','produto_garantia','produto_classe_produto','produto_qtd_volumes'] }
  ];

  // Validação por etapa
  const validationSchemas = sections.map((section, idx) => {
    if (idx === 0) {
      return Yup.object({
        produto_nome: Yup.string().required('Nome é obrigatório'),
        produto_codigo: Yup.string().required('Código é obrigatório'),
        produto_preco: Yup.number().typeError('Preço deve ser um número').required('Preço é obrigatório')
      });
    }
    // demais etapas sem validações obrigatórias
    return Yup.object();
  });

  // Snackbar helpers
  const showSnackbar = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Access token is missing');
    router.push('/auth/login');
  }

  // Carrega dados no modo edição
  useEffect(() => {
    if (isEditing) {
      axios.get(`${process.env.NEXT_PUBLIC_API}/api/produtos/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then(({ data }) => setInitialValues(prev => ({ ...prev, ...data.produto, produto_id: data.produto.id })))
        .catch(err => { console.error(err); showSnackbar('Erro ao carregar produto.', 'error'); });
    }
  }, [isEditing, params.id]);


  return (
    <Box sx={{ p:3, maxWidth:1600, margin:'0 auto' }}>
      <Typography variant="h4" mb={3}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb:4 }}>
        {sections.map(({ title }) => (
          <Step key={title}><StepLabel>{title}</StepLabel></Step>
        ))}
      </Stepper>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchemas[activeStep]}
        onSubmit={async (values, { setSubmitting }) => {
          if (activeStep < sections.length - 1) {
            setActiveStep(prev => prev + 1);
            setSubmitting(false);
            return;
          }
          // última etapa: salvar
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/produto`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify(values)
            });

            if (!response.ok) {
              showSnackbar('Erro ao salvar produto!', 'error');
              throw new Error('Erro na requisição');
            }

            showSnackbar('Produto salvo com sucesso!', 'success');
            setTimeout(() => router.push('/apps/produtos/buscar'), 1500);
          } catch (err) {
            console.error(err);
            showSnackbar('Erro ao salvar produto!', 'error');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, validateForm, setTouched }) => (
          <Form>
            <Card sx={{ mb:4 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {sections[activeStep].fields.map(field => {
                    const name = field as keyof ProdutoFormValues;
                    const isPreco = precoFields.includes(name);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={name}>
                        <TextField
                          fullWidth
                          name={name}
                          label={name.replace('produto_','').split('_')
                            .map(w => w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ')}
                          type={isPreco ? 'number' : 'text'}
                          value={values[name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched[name] && errors[name])}
                          helperText={touched[name] && errors[name] ? errors[name] : ''}
                          InputProps={isPreco ? {
                            startAdornment:<InputAdornment position="start">R$</InputAdornment>,
                            inputProps:{ step:'0.01', min:0 }
                          } : undefined}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display:'flex', justifyContent:'space-between', mt:2 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0 || isSubmitting}
                onClick={() => setActiveStep(prev => prev - 1)}
              >Anterior</Button>

              {activeStep < sections.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={async () => {
                    setTouched(Object.fromEntries(sections[activeStep].fields.map(f => [f, true])) as any);
                    const errs = await validateForm();
                    const stepErrors = Object.keys(errs).filter(errKey => sections[activeStep].fields.includes(errKey));
                    if (stepErrors.length === 0) setActiveStep(prev => prev + 1);
                  }}
                >Próximo</Button>
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  startIcon={<Save />}
                >{isEditing ? 'Atualizar Produto' : 'Salvar Produto'}</LoadingButton>
              )}
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        sx={{ '& .MuiPaper-root':{
          borderRadius:'12px', boxShadow:'0px 4px 20px rgba(0,0,0,0.15)', backdropFilter:'blur(4px)',
          backgroundColor: snackbar.severity === 'success' ? 'rgba(46,125,50,0.9)' : 'rgba(211,47,47,0.9)'
        } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          icon={false}
          sx={{ width:'100%', alignItems:'center', fontSize:'0.875rem', fontWeight:500, color:'common.white', '& .MuiAlert-message':{ display:'flex', alignItems:'center', gap:1 } }}
        >{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
