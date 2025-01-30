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
            helperText="A altura em centimetros da superfície da bandeira."
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
            <Button variant="contained">Calcular</Button>
          </div>
          <div style={{ marginTop: '20px' }}>


            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6" style={{ marginBottom: '20px', marginTop: '30px' }}>
                Resultados:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography>
                    Valor Mínimo Pessoal Simples: <strong>R$ {(FATOR_MINIMO_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Normal Pessoal Simples: <strong>R$ {(FATOR_NORMAL_PESSOAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Mínimo Pessoal Dupla: <strong>R$ {((FATOR_MINIMO_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Normal Pessoal Dupla: <strong>R$ {((FATOR_NORMAL_PESSOAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography>
                    Valor Mínimo Empresarial Simples: <strong>R$ {(FATOR_MINIMO_EMPRESARIAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Normal Empresarial Simples: <strong>R$ {(FATOR_NORMAL_EMPRESARIAL * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Mínimo Empresarial Dupla: <strong>R$ {((FATOR_MINIMO_EMPRESARIAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
                  <Typography>
                    Valor Normal Empresarial Dupla: <strong>R$ {((FATOR_NORMAL_EMPRESARIAL * 2) * quantidadeTecidoState).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </Typography>
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
