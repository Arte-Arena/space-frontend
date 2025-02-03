'use client'

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { IconCopy } from '@tabler/icons-react';

const styles = {
  label: {
    fontWeight: 'bold',
    marginRight: '8px', // Ajuste este valor para controlar o espaço
  },
  value: {
    textAlign: 'right',
    marginLeft: 'auto', // Ajuste este valor para controlar o espaço
  },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '4px',
  },
};

const PrecoBandeiraScreen = () => {

  const FATOR_NORMAL_PESSOAL = 31;
  const FATOR_NORMAL_EMPRESARIAL = 26;
  const FATOR_MINIMO_PESSOAL = 24;
  const FATOR_MINIMO_EMPRESARIAL = 22;

  const [altura, setAltura] = useState(0);
  const [largura, setLargura] = useState(0);
  const [quantidadeTecidoState, setQuantidadeTecidoState] = useState(0);

  useEffect(() => {
    if (altura && largura) {
      const quantidadeTecido = altura * largura;
      setQuantidadeTecidoState(quantidadeTecido);
    }
  }, [altura, largura]);

  return (
    <PageContainer title="Cálculo do Custo de Bandeira" description="Cálculo do Custo de Bandeira da Arte Arena">
      <Breadcrumb title="Cálculo do Custo de Bandeira" subtitle="Cálculo do Custo de Bandeira da Arte Arena" />

      <ParentCard title="Calcular o Custo de uma Bandeira">
        <div>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="altura"
          >
            Altura
          </CustomFormLabel>
          <CustomTextField
            id="altura"
            helperText="A altura em centímetros da superfície da bandeira."
            variant="outlined"
            fullWidth
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const value = (e.target as HTMLInputElement).value.replace(',', '.');
              setAltura(parseFloat(value) / 100);
            }}
          />

          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="largura"
          >
            Largura
          </CustomFormLabel>
          <CustomTextField
            id="largura"
            helperText="A largura em centimetros da superfície da bandeira."
            variant="outlined"
            fullWidth
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const value = (e.target as HTMLInputElement).value.replace(',', '.');
              setLargura(parseFloat(value) / 100);
            }}
          />

          <div style={{ marginTop: '20px' }}>
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6" style={{ marginBottom: '20px', marginTop: '30px' }}>
                Resultados:
              </Typography>
              <Grid container spacing={1}> {/* Reduzir espaçamento padrão */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Mínimo Pessoal Simples:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Mínimo Pessoal Simples: R$ ${(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Normal Pessoal Simples:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {(FATOR_NORMAL_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Normal Pessoal Simples: R$ ${(FATOR_NORMAL_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Mínimo Pessoal Dupla:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {((FATOR_MINIMO_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Mínimo Pessoal Dupla: R$ {((FATOR_MINIMO_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Normal Pessoal Dupla:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {((FATOR_NORMAL_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Normal Pessoal Dupla: R$ ${((FATOR_NORMAL_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Mínimo Pessoal Simples:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Mínimo Pessoal Simples: R$ ${(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Normal Empresarial Simples:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {(FATOR_NORMAL_EMPRESARIAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Normal Empresarial Simples: R$ ${(FATOR_NORMAL_EMPRESARIAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Mínimo Empresarial Dupla:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {((FATOR_MINIMO_EMPRESARIAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Mínimo Empresarial Dupla: R$ ${((FATOR_MINIMO_EMPRESARIAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                  <Box sx={{ ...styles.row, display: 'float', alignItems: 'center' }}>
                    <Typography component="span" sx={{ ...styles.label, marginRight: '8px' }}>
                      Valor Mínimo Pessoal Simples:
                    </Typography>
                    <Typography component="span" sx={{ ...styles.value, marginRight: '4px' }}>
                      R$ {(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Valor Mínimo Pessoal Simples: R$ ${(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                      }}
                    >
                      <IconCopy />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>

      </ParentCard>
    </PageContainer>
  );
};

export default PrecoBandeiraScreen;
