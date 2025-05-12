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
import { ContaFormProps, Parcela, RecorrenciaFormData } from "./types";
import RecorrenciaFormDialog from "./recorrenciaForm";
import CustomStyledSwitch from "@/app/components/switch/switch";

const formasPagamento = [
  { value: "dinheiro", label: "Dinheiro físico" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "debito", label: "Cartão de Débito" },
  { value: "credito", label: "Cartão de Crédito" },
];

const opcoesRecorrencia: string[] = [
  "Diaria",
  "Semanal",
  "Quinzenal",
  "Mensal",
  "Bimestral",
  "Trimestral",
  "Semestral",
  "Anual",
  "Personalizada",
]

const ContaForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = "Salvar",
}: ContaFormProps) => {
  const parseParcelaData = (data: string | Date): string => {
    // Caso já esteja em formato ISO ou Date
    if (data instanceof Date) return dayjs(data).format('YYYY-MM-DD');
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data; // já está em ISO

    // Parse "dd/MM/yyyy"
    const [dia, mes, ano] = data.split('/');
    if (!dia || !mes || !ano) return dayjs().format('YYYY-MM-DD'); // fallback
    return dayjs(`${ano}-${mes}-${dia}`).format('YYYY-MM-DD');
  };

  const [mostrarRecorrencia, setMostrarRecorrencia] = useState<boolean>(false);
  const [titulo, setTitulo] = useState(initialValues.titulo || "");
  const [descricao, setDescricao] = useState(initialValues.descricao || "");
  const [valor, setValor] = useState(initialValues.valor || 0);
  const [dataVencimento, setDataVencimento] = useState(
    initialValues.data_vencimento ? new Date(initialValues.data_vencimento) : null
  );
  const [status, setStatus] = useState(initialValues.status || "");
  const [tipo, setTipo] = useState(initialValues.tipo || "");

  const [parcelas, setParcelas] = useState<Parcela[]>(
    (initialValues.parcelas || []).map((p: Parcela) => ({
      ...p,
      data: parseParcelaData(p.data),
    }))
  );

  const [dataPagamento, setDataPagamento] = useState(
    initialValues.data_pagamento ? new Date(initialValues.data_pagamento) : null
  );
  const [dataEmissao, setDataEmissao] = useState(
    initialValues.data_emissao ? new Date(initialValues.data_emissao) : null
  );
  const [formaPagamento, setFormaPagamento] = useState(initialValues.forma_pagamento || "");
  const [orcamentoStatusId, setOrcamentoStatusId] = useState(initialValues.orcamento_staus_id || "");
  const [estoqueId, setEstoqueId] = useState(initialValues.estoque_id || "");
  const [estoqueQuantidade, setEstoqueQuantidade] = useState(initialValues.estoque_quantidade || "");
  const [recorrencia, setRecorrencia] = useState<string>(initialValues.recorrencia || "mensal");
  const [fixa, setFixa] = useState(initialValues.fixa || false);
  const [documento, setDocumento] = useState(initialValues.documento || "");
  const [observacoes, setObservacoes] = useState(initialValues.observacoes || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContaId, setSelectedContaId] = useState<number | string | null | undefined>(null);
  const [recorrenciaData, setRecorrenciaData] = useState<RecorrenciaFormData | null>(null);
  dayjs.extend(utc);

  useEffect(() => {
    if (initialValues.recorrente) {
      setMostrarRecorrencia(true);
      setRecorrenciaData({
        ...initialValues.recorrente,
        tipo_recorrencia:
          initialValues.recorrente.tipo_recorrencia.charAt(0).toUpperCase() +
          initialValues.recorrente.tipo_recorrencia.slice(1),
      });
      setRecorrencia(
        initialValues.recorrente.tipo_recorrencia.charAt(0).toUpperCase() +
          initialValues.recorrente.tipo_recorrencia.slice(1)
      );
    }
  }, [initialValues.recorrente]);

  const handleSaveRecorrencia = (data: RecorrenciaFormData) => {
    setRecorrenciaData(data);
    setRecorrencia(data.tipo_recorrencia);
    handleCloseDialog();
  };

  const handleOpenDialog = (contaId: number | string | null) => {
    setSelectedContaId(contaId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContaId(null);
  };

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
    if (parcelas.length > 0) {
      const ultimaParcela = parcelas[parcelas.length - 1];
      novaData = dayjs(ultimaParcela.data).add(30, "day").format("YYYY-MM-DD");
    } else {
      novaData = dayjs().format("YYYY-MM-DD");
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
      titulo,
      descricao,
      valor,
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
      recorrente: recorrenciaData,
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
            <MenuItem value="a pagar">A Pagar</MenuItem>
            <MenuItem value="a receber">A Receber</MenuItem>
          </CustomSelect>
        </Grid>

        <Grid item xs={12} sm={3}>
          <CustomFormLabel>Documento</CustomFormLabel>
          <CustomTextField
            value={documento}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDocumento(e.target.value)
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
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
        <Grid item xs={6} sm={6} md={6}>
          <CustomFormLabel>Recorrência?</CustomFormLabel>
          <FormControlLabel
            control={
              <CustomStyledSwitch
                checked={mostrarRecorrencia}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMostrarRecorrencia(e.target.checked)
                }
              />
            }
            label={mostrarRecorrencia ? "Sim" : "Não"}
          />
        </Grid>

        {mostrarRecorrencia && (
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={7} md={8}>
                <CustomFormLabel htmlFor="recorrencia-autocomplete">Configuração da Recorrência</CustomFormLabel>
                <Autocomplete
                  id="recorrencia-autocomplete"
                  freeSolo
                  options={opcoesRecorrencia}
                  value={recorrencia} // Este é o campo de texto livre
                  onInputChange={(_, newInputValue) => {
                    setRecorrencia(newInputValue);
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      placeholder="Ex: Mensal a cada 2 meses (use o botão para detalhes)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {/* O alignItems="flex-end" no container pai ajuda.
                    Para o botão ter a mesma altura do TextField do Autocomplete:
                    - Garanta que o CustomTextField tenha uma altura padrão (MUI TextField ~56px)
                    - Você pode setar uma altura fixa no botão ou usar padding.
                */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(initialValues.id || null)} // Passar o ID da conta atual se estiver editando
                  fullWidth // Faz o botão ocupar a largura do seu Grid item
                  sx={{
                    // Ajuste a altura se o CustomTextField tiver uma altura padrão, ex:
                    // height: '56px', (para TextField outlined padrão)
                    // ou mb: se o label do autocomplete estiver acima e quiser alinhar pela base do campo
                    // mb: 0.5 // Exemplo se o Autocomplete tiver um label
                  }}
                >
                  Detalhes da Recorrência
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

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

            <Grid item xs={6}>
              <Button variant="contained" onClick={handleSubmit} fullWidth>
                {submitLabel}
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <RecorrenciaFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        contaId={selectedContaId || null}
        onSave={handleSaveRecorrencia}
        tipoRecorrencia={recorrencia}
        setTipoRecorrencia={setRecorrencia}
        intervalo="1"
        setIntervalo={() => { }}
        initialData={recorrenciaData}
      />
    </Box>
  );
};

export default ContaForm;
