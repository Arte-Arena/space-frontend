'use client'

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Button } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import Typography from '@mui/material/Typography';

const CustoBandeiraScreen = () => {

  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [custoTecido, setCustoTecido] = useState('');
  const [custoTinta, setCustoTinta] = useState('');
  const [custoPapel, setCustoPapel] = useState('');
  const [custoImposto, setCustoImposto] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularCusto = () => {
    if (!altura || !largura) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const area = parseFloat(altura) * parseFloat(largura);
    const custoTotalTecido = area * parseFloat(custoTecido);
    const custoTotalTinta = area * parseFloat(custoTinta);
    const custoTotalPapel = area * parseFloat(custoPapel);
    const custoTotalImposto = (custoTotalTecido + custoTotalTinta + custoTotalPapel) * parseFloat(custoImposto);
    const custoFinal = custoTotalTecido + custoTotalTinta + custoTotalPapel + custoTotalImposto;

    setResultado(custoFinal);

    const data = {
      altura: parseFloat(altura),
      largura: parseFloat(largura),
      custo_tecido: parseFloat(custoTecido),
      custo_tinta: parseFloat(custoTinta),
      custo_papel: parseFloat(custoPapel),
      custo_imposto: parseFloat(custoImposto),
      custo_final: custoFinal,
    };

    const token = localStorage.getItem('accessToken') || '';

    fetch('http://localhost:8000/api/custo-bandeira', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const token = localStorage.getItem('accessToken') || '';

      try {
        const response = await fetch('http://localhost:8000/api/super-admin/get-config', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch config');
        }

        const data = await response.json();

        setCustoTecido(data.custo_tecido);
        setCustoTinta(data.custo_tinta);
        setCustoPapel(data.custo_papel);
        setCustoImposto(data.custo_imposto);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <PageContainer title="Cálculo do Custo de Bandeira" description="Cálculo do Custo de Bandeira da Arte Arena">
      <Breadcrumb title="Cálculo do Custo de Bandeira" subtitle="Cálculo do Custo de Bandeira da Arte Arena" />

      <ParentCard title="Calcular o Custo de uma Bandeira">
        <form style={{ maxWidth: '600px' }}>

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
            helperText="A altura em metros da superfície da bandeira."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAltura(e.target.value)}
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
            helperText="A largura em metros da superfície da bandeira."
            variant="outlined"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLargura(e.target.value)}
          />

          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" onClick={calcularCusto}>Calcular</Button>
          </div>
          {resultado !== null && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h5">
                O custo total da bandeira é: <strong>R$ {resultado}</strong>
              </Typography>
            </div>
          )}

        </form>

      </ParentCard>
    </PageContainer>
  );
};

export default CustoBandeiraScreen;
