'use client';

import React, { useState } from 'react';
import { Stack, Button, Typography, Box } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import MenuItem from '@mui/material/MenuItem';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { format, parseISO } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputAdornment from '@mui/material/InputAdornment';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useRouter } from 'next/navigation';
import useAprovarOrcamentos from '@/utils/SelectAprovarOrcamento';

// Wrapper para o NumericFormat com forwardRef
const NumericFormatCustom = React.forwardRef<HTMLElement, NumericFormatProps>((props, ref) => (
  <NumericFormat
    {...props}
    getInputRef={ref}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={2}
    fixedDecimalScale
  />
));
NumericFormatCustom.displayName = 'NumericFormatCustom';

const OrcamentoAprovarEspecificoScreen = ({ params }: { params: { id: string } }) => {
  const orcamentoId = params.id || null;
  // id para puxar os dados do orçamento.
  const id = parseFloat(params.id);

  const router = useRouter();

  const [formaPagamento, setFormaPagamento] = useState('');
  const [tipoFaturamento, setTipoFaturamento] = useState('');
  const [qtdParcelas, setQtdParcelas] = useState('1'); // Default para "1" no tipo faturado
  const [dataFatura1, setDataFatura1] = useState<Date | null>(new Date());
  const [valorFatura1, setValorFatura1] = useState('');
  const [dataFatura2, setDataFatura2] = useState<Date | null>(null);
  const [valorFatura2, setValorFatura2] = useState('');
  const [dataFatura3, setDataFatura3] = useState<Date | null>(null);
  const [valorFatura3, setValorFatura3] = useState('');
  const [dataEntrega, setDataEntrega] = useState<Date | null>(null);
  const [linkTrello, setLinkTrello] = useState('');
  const [comentarios, setComentarios] = useState('');
  const { data: orcamento, error: orcamentoError, isLoading: orcamentoLoading } = useAprovarOrcamentos(id); 

  console.log(orcamento?.[0])

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data não disponível";
    return format(parseISO(dataString), "dd/MM/yyyy");
  };

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
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(() => {
        console.log('Orçamento aprovado com sucesso');
        router.push(`/apps/orcamento/buscar`);
      });
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>
        Aprovar Orçamento #{orcamentoId}
      </Typography>

      <Box sx={{marginBottom: '30px', display: 'flex', gap: '2rem'}}>
        {orcamento?.[0]?.total_orcamento !== null &&(
          <Typography style={{fontWeight: '600'}}>
            Total Orçamento: R$ {orcamento?.[0]?.total_orcamento}
          </Typography>
        )}

        {orcamento?.[0]?.data_antecipa !== null &&(
          <Typography style={{fontWeight: '600'}}>
            Data de antecipação {formatarData(orcamento?.[0]?.data_antecipa)}
          </Typography>
        )}

        {orcamento?.[0]?.created_at !== null &&(
          <Typography style={{fontWeight: '600'}}>
            Data de Criação: {formatarData(orcamento?.[0]?.created_at )}
          </Typography>
        )}

      </Box>


      <Stack spacing={2}>
        {/* Forma de Pagamento */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <CustomFormLabel htmlFor="forma_pagamento">Forma de Pagamento</CustomFormLabel>
          <CustomSelect
            name="forma_pagamento"
            value={formaPagamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormaPagamento(event.target.value)}
            sx={{ flexGrow: 1, ml: 2 }}
          >
            <MenuItem value="dinheiro">Dinheiro físico</MenuItem>
            <MenuItem value="pix">PIX</MenuItem>
            <MenuItem value="debito">Cartão de Débito</MenuItem>
            <MenuItem value="credito">Cartão de Crédito</MenuItem>
          </CustomSelect>
        </Box>

        {/* Tipo de Faturamento */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <CustomFormLabel htmlFor="tipo_faturamento">Tipo de Faturamento</CustomFormLabel>
          <CustomSelect
            name="tipo_faturamento"
            value={tipoFaturamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              setTipoFaturamento(value);

              // Lógica para tipos específicos
              if (value === 'faturado') {
                setQtdParcelas('1'); // Default para "faturado"
              } else if (value === 'parcelado') {
                setQtdParcelas('2'); // Sempre 2 parcelas no tipo "parcelado"
              }
            }}
            sx={{ flexGrow: 1, ml: 2 }}
          >
            <MenuItem value="a_vista">À Vista</MenuItem>
            <MenuItem value="parcelado">Parcelado (metade/metade)</MenuItem>
            <MenuItem value="faturado">Faturado</MenuItem>
          </CustomSelect>
        </Box>

        {/* Quantidade de Parcelas */}
        {tipoFaturamento === 'faturado' && (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <CustomFormLabel htmlFor="qtd_parcelas">Quantidade de Parcelas</CustomFormLabel>
            <CustomSelect
              name="qtd_parcelas"
              value={qtdParcelas}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQtdParcelas(event.target.value)}
              sx={{ flexGrow: 1, ml: 2 }}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </CustomSelect>
          </Box>
        )}

        {/* Campos dinâmicos para parcelas */}
        <Box>
          {/* Fatura 1 */}
          <Box display="flex" gap={2}>
            <Box flex={1}>
              <CustomFormLabel htmlFor="data_fatura1">Data da Fatura #1</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data Fatura #1"
                  value={dataFatura1}
                  onChange={(newValue) => setDataFatura1(newValue)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>
            <Box flex={1}>
              <CustomFormLabel htmlFor="valor_fatura1">Valor Fatura #1</CustomFormLabel>
              <CustomTextField
                name="valor_fatura1"
                value={valorFatura1}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValorFatura1(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  inputComponent: NumericFormatCustom as any,
                }}
                fullWidth
              />
            </Box>
          </Box>

          {/* Fatura 2 (parcelado ou mais de 1 parcela no faturado) */}
          {(tipoFaturamento === 'parcelado' || qtdParcelas === '2' || qtdParcelas === '3') && (
            <Box display="flex" gap={2} mt={2}>
              <Box flex={1}>
                <CustomFormLabel htmlFor="data_fatura2">Data da Fatura #2</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data Fatura #2"
                    value={dataFatura2}
                    onChange={(newValue) => setDataFatura2(newValue)}
                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Box>
              <Box flex={1}>
                <CustomFormLabel htmlFor="valor_fatura2">Valor Fatura #2</CustomFormLabel>
                <CustomTextField
                  name="valor_fatura2"
                  value={valorFatura2}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValorFatura2(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputComponent: NumericFormatCustom as any,
                  }}
                  fullWidth
                />
              </Box>
            </Box>
          )}

          {/* Fatura 3 (se 3 parcelas no faturado) */}
          {qtdParcelas === '3' && (
            <Box display="flex" gap={2} mt={2}>
              <Box flex={1}>
                <CustomFormLabel htmlFor="data_fatura3">Data da Fatura #3</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data Fatura #3"
                    value={dataFatura3}
                    onChange={(newValue) => setDataFatura3(newValue)}
                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Box>
              <Box flex={1}>
                <CustomFormLabel htmlFor="valor_fatura3">Valor Fatura #3</CustomFormLabel>
                <CustomTextField
                  name="valor_fatura3"
                  value={valorFatura3}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValorFatura3(event.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    inputComponent: NumericFormatCustom as any,
                  }}
                  fullWidth
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Data de Entrega */}
        <Box>
          <CustomFormLabel htmlFor="data_entrega">Data de Entrega</CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Data de Entrega"
              value={dataEntrega}
              onChange={(newValue) => setDataEntrega(newValue)}
              renderInput={(params) => <CustomTextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>

        {/* Link do Trello */}
        <Box>
          <CustomFormLabel htmlFor="link_trello">Link do Trello</CustomFormLabel>
          <CustomTextField
            name="link_trello"
            value={linkTrello}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkTrello(event.target.value)}
            fullWidth
          />
        </Box>

        {/* Comentários */}
        <Box>
          <CustomFormLabel htmlFor="comentarios">Comentários</CustomFormLabel>
          <CustomTextField
            name="comentarios"
            value={comentarios}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComentarios(event.target.value)}
            multiline
            rows={4}
            fullWidth
          />
        </Box>

        {/* Botão de Aprovar */}
        <Box sx={{ mt: 3, mb: 5 }}>
          <Button variant="contained" color="primary" onClick={aprovaOrcamento}>
            Aprovar Orçamento
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default OrcamentoAprovarEspecificoScreen;
