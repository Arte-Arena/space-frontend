"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  MenuItem,
  FormControlLabel,
  Button,
  Box,
  TextField,
  IconButton,
  Autocomplete,
  Typography,
} from "@mui/material";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { NumericFormat } from "react-number-format";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ContaFormProps, Parcela } from "./types";

const formasPagamento = [
  { value: "dinheiro", label: "Dinheiro físico" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "debito", label: "Cartão de Débito" },
  { value: "credito", label: "Cartão de Crédito" },
];

const opcoesRecorrencia = [
  "Mensal",
  "Bimestral",
  "Trimestral",
  "Semestral",
  "Anual",
];

const ContaForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = "Salvar",
}: ContaFormProps) => {
  const [titulo, setTitulo] = useState(initialValues.titulo || "");
  const [descricao, setDescricao] = useState(initialValues.descricao || "");
  const [valor, setValor] = useState(initialValues.valor || 0);
  const [dataVencimento, setDataVencimento] = useState(
    initialValues.data_vencimento
      ? new Date(initialValues.data_vencimento)
      : null
  );
  const [status, setStatus] = useState(initialValues.status || "");
  const [tipo, setTipo] = useState(initialValues.tipo || "");
  const [parcelas, setParcelas] = useState<Parcela[]>(
    initialValues.parcelas || []
  );
  const [dataPagamento, setDataPagamento] = useState(
    initialValues.data_pagamento ? new Date(initialValues.data_pagamento) : null
  );
  const [dataEmissao, setDataEmissao] = useState(
    initialValues.data_emissao ? new Date(initialValues.data_emissao) : null
  );
  const [formaPagamento, setFormaPagamento] = useState(
    initialValues.forma_pagamento || ""
  );
  const [orcamentoStatusId, setOrcamentoStatusId] = useState(
    initialValues.orcamento_staus_id || ""
  );
  const [estoqueId, setEstoqueId] = useState(initialValues.estoque_id || "");
  const [estoqueQuantidade, setEstoqueQuantidade] = useState(initialValues.estoque_quantidade || "");
  const [recorrencia, setRecorrencia] = useState(
    initialValues.recorrencia || ""
  );
  const [fixa, setFixa] = useState(initialValues.fixa || false);
  const [documento, setDocumento] = useState(initialValues.documento || "");
  const [observacoes, setObservacoes] = useState(
    initialValues.observacoes || ""
  );

  dayjs.extend(utc);

  const handleParcelasChange = <K extends keyof Parcela>(
    index: number,
    field: K,
    value: Parcela[K]
  ) => {
    const updated = [...parcelas];
    updated[index][field] = value;
    setParcelas(updated);
  };

  const adicionarParcela = () => {
    let novaData;
    // Pega a data da última parcela e adiciona 30 dias
    if (parcelas.length > 0) {
      const ultimaParcela = parcelas[parcelas.length - 1];
      novaData = dayjs(ultimaParcela.data).add(30, 'day').format('YYYY-MM-DD');
    } else {
      // Se for a primeira parcela, usa a data atual
      novaData = dayjs().format('YYYY-MM-DD');
    }

    const novaParcela: Parcela = {
      parcela: parcelas.length + 1,
      data: novaData,
      status: "Não Pago",
      valor: 0,
    };
    setParcelas([...parcelas, novaParcela]);
  };

  const removerParcela = (index: number) => {
    const updated = parcelas
      .filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, parcela: i + 1 }));
    setParcelas(updated);
  };

  const handleSubmit = () => {
    onSubmit({
      titulo: titulo,
      descricao: descricao,
      valor: valor,
      data_vencimento: dataVencimento?.toISOString().split("T")[0],
      status: status.toLowerCase(),
      tipo: tipo.toLowerCase(),
      parcelas,
      data_pagamento: dataPagamento?.toISOString().split("T")[0],
      data_emissao: dataEmissao?.toISOString().split("T")[0],
      forma_pagamento: formaPagamento,
      orcamento_staus_id: orcamentoStatusId,
      estoque_id: estoqueId,
      estoque_quantidade: estoqueQuantidade,
      recorrencia,
      fixa,
      documento,
      observacoes,
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Linha 1 - Título e Descrição */}
        <Grid item xs={12} md={6}>
          <CustomFormLabel>Título</CustomFormLabel>
          <CustomTextField
            value={titulo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitulo(e.target.value)
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomFormLabel>Descrição</CustomFormLabel>
          <CustomTextField
            value={descricao}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescricao(e.target.value)
            }
            fullWidth
          />
        </Grid>

        {/* Linha 7 - Observações */}
        <Grid item xs={12}>
          <CustomFormLabel>Observações</CustomFormLabel>
          <CustomTextField
            value={observacoes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setObservacoes(e.target.value)
            }
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        {/* Linha 6 - Parcelas */}
        <Grid item xs={12}>
          <CustomFormLabel>Parcelas</CustomFormLabel>
          <Box sx={{ my: 1 }}>
            {parcelas.map((parcela, index) => (
              <Grid
                container
                spacing={1}
                key={index}
                my={0.1}
                alignItems="center"
              >
                <Grid item xs={2} sm={1}>
                  <CustomTextField
                    label="Nº"
                    type="number"
                    value={parcela.parcela}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleParcelasChange(
                        index,
                        "parcela",
                        Number(e.target.value)
                      )
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={5} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data"
                      inputFormat="dd/MM/yyyy"
                      value={parcela.data ? dayjs(parcela.data) : null}
                      onChange={(newValue) => {
                        const dateStr = newValue
                          ? dayjs(newValue).format('YYYY-MM-DD')
                          : "";
                        handleParcelasChange(index, "data", dateStr);

                        // Atualiza automaticamente as datas das parcelas seguintes
                        if (index < parcelas.length - 1) {
                          const updatedParcelas = [...parcelas];
                          for (let i = index + 1; i < parcelas.length; i++) {
                            updatedParcelas[i].data = dayjs(updatedParcelas[i - 1].data)
                              .add(30, 'day')
                              .format('YYYY-MM-DD');
                          }
                          setParcelas(updatedParcelas);
                        }
                      }}
                      renderInput={(params) => <CustomTextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <CustomTextField
                    label="Status"
                    value={parcela.status}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleParcelasChange(index, "status", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} sm={2}>
                  <NumericFormat
                    value={parcela.valor}
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    onValueChange={(values) => {
                      handleParcelasChange(index, "valor", values.floatValue || 0);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    color="error"
                    onClick={() => removerParcela(index)}
                  >
                    <RemoveCircle />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
          <Box mt={1}>
            <Button onClick={adicionarParcela} startIcon={<AddCircle />}>
              Adicionar Parcela
            </Button>
          </Box>
        </Grid>

        {/* Linha 2 - Valor, Vencimento, Pagamento, Emissão */}
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Valor Total</CustomFormLabel>
          <NumericFormat
            value={valor}
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setValor(e.target.value)
            // }
            onValueChange={(values) => {
              setValor(values.floatValue || 0);
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Vencimento</CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              value={dataVencimento}
              onChange={setDataVencimento}
              renderInput={(params) => (
                <CustomTextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Pagamento</CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              value={dataPagamento}
              onChange={setDataPagamento}
              renderInput={(params) => (
                <CustomTextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Emissão</CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              value={dataEmissao}
              onChange={setDataEmissao}
              renderInput={(params) => (
                <CustomTextField {...params} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/* Linha 3 - Forma Pagamento, Status, Tipo, Fixa */}
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Forma Pagamento</CustomFormLabel>
          <CustomSelect
            value={formaPagamento}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              setFormaPagamento(e.target.value as string)
            }
            fullWidth
          >
            {formasPagamento.map((fp) => (
              <MenuItem key={fp.value} value={fp.value}>
                {fp.label}
              </MenuItem>
            ))}
          </CustomSelect>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Status</CustomFormLabel>
          <CustomSelect
            value={status}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              setStatus(e.target.value as string)
            }
            fullWidth
          >
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="recebido">Recebido</MenuItem>
          </CustomSelect>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Tipo</CustomFormLabel>
          <CustomSelect
            value={tipo}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              setTipo(e.target.value as string)
            }
            fullWidth
          >
            <MenuItem value="A Pagar">A Pagar</MenuItem>
            <MenuItem value="A Receber">A Receber</MenuItem>
          </CustomSelect>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CustomFormLabel>Fixa</CustomFormLabel>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={fixa}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFixa(e.target.checked)
                }
              />
            }
            label="Será uma conta fixa?"
          />
        </Grid>

        {/* Linha 4 - Recorrência, Documento */}
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Recorrência</CustomFormLabel>
          <Autocomplete
            freeSolo
            options={opcoesRecorrencia}
            value={recorrencia}
            onInputChange={(_, newInputValue) =>
              setRecorrencia(newInputValue)
            }
            renderInput={(params) => (
              <CustomTextField
                {...params}
                placeholder="Mensal, Bimestral, Trimestral, etc."
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Documento</CustomFormLabel>
          <CustomTextField
            value={documento}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDocumento(e.target.value)
            }
            fullWidth
          />
        </Grid>

        {/* devo primeiro ver uma forma de fazer uma movimentação sempre que for aprovada uma das recorrencias de Contas */}
        {/* Linha 5 - estoque, quantidade */}
        {/* <Grid item xs={12} sm={6}>
          <CustomFormLabel>Item Estoque</CustomFormLabel>
          <CustomTextField
            value={estoqueId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOrcamentoStatusId(e.target.value)
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Quantidade Estoque</CustomFormLabel>
          <CustomTextField
            value={estoqueQuantidade}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEstoqueQuantidade(e.target.value)
            }
            fullWidth
          />
        </Grid> */}

        {/* Botão de submit */}
        <Grid item xs={12}>
          <Box mt={2}>
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              {submitLabel}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContaForm;
