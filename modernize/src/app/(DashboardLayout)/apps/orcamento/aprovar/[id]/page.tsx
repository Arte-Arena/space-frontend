'use client'
import React, { useState } from 'react';
import { Stack, Button, Box, Typography } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import MenuItem from '@mui/material/MenuItem';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const OrcamentoBuscarScreen = ({ params }: { params: { id: string } }) => {

  const orcamentoId = params.id || null;

  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [tipoFaturamento, setTipoFaturamento] = useState<string>('');
  const [dataFaturamento, setDataFaturamento] = useState<Date | null>(null);
  const [vencimentoParcela, setVencimentoParcela] = useState<Date | null>(null);
  const [qtdParcelas, setQtdParcelas] = useState<number | null>(null);
  const [dataEntrega, setDataEntrega] = useState<Date | null>(null);
  const [linkTrello, setLinkTrello] = useState<string | null>('');
  const [comentarios, setComentarios] = useState<string | null>('');

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }


  const aprovaOrcamento = () => {
    if (orcamentoId !== null) {
      fetch(`${process.env.NEXT_PUBLIC_API}/api/orcamento/status/aprova/${orcamentoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`,
        },
      }).then(() => {
        console.log('Orçamento aprovado com sucesso');
      });
    }
  };

  return (
    <>

      <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>
        Aprovar Orçamento #{orcamentoId}
      </Typography>

      <Stack spacing={2}>

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="forma_pagamento"
        >
          Forma de Pagamento
        </CustomFormLabel>
        <CustomSelect
          name="forma_pagamento"
          value={formaPagamento}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormaPagamento(event.target.value)}
        >
          <MenuItem value="dinheiro">Dinheiro físico</MenuItem>
          <MenuItem value="pix">PIX</MenuItem>
          <MenuItem value="debito">Cartão de Débido</MenuItem>
          <MenuItem value="credito">Cartão de Crédito</MenuItem>
        </CustomSelect>

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="tipo_faturamento"
        >
          Tipo de Faturamento
        </CustomFormLabel>
        <CustomSelect
          name="tipo_faturamento"
          value={tipoFaturamento}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTipoFaturamento(event.target.value)}
        >
          <MenuItem value="a_vista">À Vista</MenuItem>
          <MenuItem value="parcelado">Parcelado</MenuItem>
          <MenuItem value="fatura">Faturado</MenuItem>
        </CustomSelect>

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="data_entrega"
        >
          Data de Faturamento {tipoFaturamento === 'parcelado' ? '(1ª parcela)' : ''}
        </CustomFormLabel>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data de faturamento"
            value={dataFaturamento}
            onChange={(newValue) => setDataFaturamento(newValue)}
            renderInput={(params) => <CustomTextField {...params} />}
          />
        </LocalizationProvider>

        {tipoFaturamento === 'parcelado' && (
          <>
            <CustomFormLabel
              sx={{
                mt: 0,
              }}
              htmlFor="qtd_parcelas"
            >
              Quantidade de Parcelas
            </CustomFormLabel>
            <CustomTextField
              label="Quantidade de Parcelas"
              name="qtd_parcelas"
              value={qtdParcelas}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQtdParcelas(Number(event.target.value))}
            />
          </>
        )}

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="link_trello"
        >
          Link do Trello
        </CustomFormLabel>
        <CustomTextField
          label="Link do Trello"
          name="link_trello"
          value={linkTrello}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkTrello(event.target.value)}
        />

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="data_entrega"
        >
          Data de Entrega
        </CustomFormLabel>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data de entrega"
            value={dataEntrega}
            onChange={(newValue) => setDataEntrega(newValue)}
            renderInput={(params) => <CustomTextField {...params} />}
          />
        </LocalizationProvider>

        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="comentarios"
        >
          Informações Adicionais (opcional)
        </CustomFormLabel>
        <CustomTextField
          label="Comentários"
          name="comentarios"
          value={comentarios}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComentarios(event.target.value)}
          multiline
          rows={4}
        />


      </Stack>

      <Typography variant="body1" sx={{ mt: 5, mb: 3 }}>
        Tem certeza de que deseja aprovar este orçamento?
      </Typography>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => aprovaOrcamento()}
        >
          Aprovar
        </Button>
      </Stack>

    </>

  )
}

export default OrcamentoBuscarScreen;
