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

  const [altura, setAltura] = useState(0);
  const [largura, setLargura] = useState(0);
  const [custoTecido, setCustoTecido] = useState(0);
  const [custoTinta, setCustoTinta] = useState(0);
  const [custoPapel, setCustoPapel] = useState(0);
  const [custoImposto, setCustoImposto] = useState(0);
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularCusto = () => {
    if (!altura || !largura) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const larguraTecido = 1.5;
    var quantidadeTecido = 0;

    if (altura <= larguraTecido || largura <= larguraTecido) {
      quantidadeTecido = Math.min(altura, largura);
    } else {
      const faixas = Math.ceil(altura / larguraTecido);
      quantidadeTecido = faixas * largura;
    }

    const custoMetro = custoTecido + custoTinta + custoPapel;

    const custoSemImposto = custoMetro * quantidadeTecido;

    const custoComImposto = custoSemImposto * (1 + (custoImposto / 100));

    console.log('quantidadeTecido', quantidadeTecido);
    console.log('custoMetro', custoMetro);
    console.log('custoSemImposto', custoSemImposto);
    console.log('custoComImposto', custoComImposto);
    
    setResultado(custoComImposto);

    const data = {
      altura: altura,
      largura: largura,
      custo_tecido: custoTecido,
      custo_tinta: custoTinta,
      custo_papel: custoPapel,
      custo_imposto: custoImposto,
      custo_final: custoComImposto,
    };

    const token = localStorage.getItem('accessToken') || '';

    fetch(`${process.env.NEXT_PUBLIC_API}/api/custo-bandeira`, {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config`, {
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
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const value = (e.target as HTMLInputElement).value.replace(',', '.');
              setAltura(parseFloat(value));
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
            helperText="A largura em metros da superfície da bandeira."
            variant="outlined"
            fullWidth
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const value = (e.target as HTMLInputElement).value.replace(',', '.');
              setLargura(parseFloat(value));
            }}
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
