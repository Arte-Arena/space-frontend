'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  AttachMoney,
  CheckCircle,
  Receipt,
  CreditCard,
  Store,
  Info,
  ErrorOutline, // Usaremos este para consistência com MUI, em vez de IconX
  VerifiedUser,
  Link as LinkIcon,
  CalendarToday,
  SwapHoriz,
  Category,
  Label,
  Payment,
  Description,
  Source,
  Person,
  Email,
  ContactPhone,
  Fingerprint,
  Business,
  ShoppingCart,
  NetworkCheck,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
// Se IconX for realmente necessário de @tabler/icons-react, descomente a linha abaixo.
// import { IconX } from '@tabler/icons-react';

// --- Tipagem dos Dados (Reintroduzida para robustez) ---
interface CardHolder {
  name: string | null;
  identification?: {
    type: string | null;
    number: string | null;
  };
}

interface CardDetails {
  id?: string;
  bin?: string;
  tags?: string[];
  country?: string;
  cardholder?: CardHolder;
  date_created?: string;
  expiration_year?: number | null;
  expiration_month?: number | null;
  first_six_digits?: string;
  last_four_digits?: string;
  date_last_updated?: string;
}

interface PayerIdentification {
  type: string | null;
  number: string | null;
}

interface PayerPhone {
  number: string | null;
  area_code?: string | null;
  extension?: string | null;
}

interface PayerDetails {
  id: string | null;
  type?: string | null;
  email: string | null;
  phone?: PayerPhone;
  last_name?: string | null;
  first_name?: string | null;
  identification?: PayerIdentification;
}

interface OrderDetails {
  id?: string;
  type?: string;
}

interface AdditionalInfoItem {
  title?: string;
  quantity?: string;
  unit_price?: string;
  description?: string;
  picture_url?: string;
}

interface TransactionDetailsPlatform {
  net_received_amount?: number;
  total_paid_amount?: number;
  installment_amount?: number;
}

interface PointOfInteraction {
    type?: string;
    business_info?: {
        unit?: string;
        sub_unit?: string;
        branch?: string;
    };
    application_data?: {
        name?: string;
        version?: string;
    };
    location?: {
        state_id?: string;
        source?: string;
    }
}

interface PlatformDetails {
  id: number | string;
  card?: CardDetails;
  order?: OrderDetails;
  payer: PayerDetails;
  status: string;
  currency_id?: string;
  description?: string;
  installments?: number;
  date_created?: string;
  date_approved?: string;
  operation_type?: string;
  payment_method?: { id: string; type: string; issuer_id?: string };
  additional_info?: {
    items?: AdditionalInfoItem[];
    ip_address?: string;
  };
  transaction_amount?: number;
  transaction_details?: TransactionDetailsPlatform;
  money_release_date?: string;
  money_release_status?: string;
  point_of_interaction?: PointOfInteraction;
  statement_descriptor?: string;
  authorization_code?: string;
  status_detail?: string;
}

export interface TransacaoData {
  id: number;
  carteira_id: number;
  movimentacao_financeira_id: number | null;
  id_transacao_externa: string;
  data_transacao: string;
  data_lancamento: string;
  tipo_operacao: 'entrada' | 'saida' | string;
  descricao: string;
  valor: string;
  valor_taxas: string;
  tipo: string;
  categoria: string;
  status: string;
  detalhes: PlatformDetails;
  conciliado: boolean;
  plataforma: string;
  fonte_dados: string;
  valor_liquido: string;
  documento_pagador: string;
  nome_pagador: string;
  email_pagador: string;
  chave_conciliacao: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  transacao: TransacaoData;
  movimentacoes_parecidas?: TransacaoData[]; // Opcional, caso não venha
  meta?: { // Opcional, caso não venha
    total_movimentacoes_parecidas: number;
    margem_percentual: number;
  };
}
// --- Fim da Tipagem ---


// Agrupa itens em arrays de até `size`
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Definição do tipo para os itens passados para renderRows
type DetailRowItem = {
  icon?: React.ReactElement; // Ícone é ReactElement
  label: string;
  value: React.ReactNode; // Valor pode ser qualquer nó React
};


// Renderiza linhas de até 3 colunas com justificação dinâmica
const renderRows = (items: DetailRowItem[]) => {
  // Filtra itens com valor nulo ou indefinido, a menos que o valor seja explicitamente '0' ou um booleano false
  const validItems = items.filter(item =>
    item.value !== null &&
    item.value !== undefined &&
    (typeof item.value === 'string' ? item.value.trim() !== '' : true) ||
    item.value === 0 || // Permite o número 0
    item.value === false // Permite o booleano false
  );

  if (validItems.length === 0) return null; // Não renderiza nada se não houver itens válidos

  return chunkArray(validItems, 3).map((row, i) => {
    // Ajusta a justificação baseada no número de itens na linha atual
    // Se houver 2 itens, usa 'space-between'. Se houver 1, 'flex-start'. Para 3, 'space-evenly'.
    const justifyContent = row.length === 2 ? 'space-between' : row.length === 1 ? 'flex-start' : 'space-evenly';
    // Calcula a largura da coluna para os itens. sm={12} para 1 item, sm={6} para 2, sm={4} para 3.
    const sm = row.length > 0 ? Math.floor(12 / row.length) : 12;

    return (
      <Grid container spacing={2} justifyContent={justifyContent} key={i} sx={{ mb: row.length > 0 ? 2 : 0 }}>
        {row.map((item, idx) => (
          <Grid item xs={12} sm={sm} key={idx}>
            <Box display="flex" alignItems="flex-start"> {/* Alinha ícone e label no topo */}
              {item.icon && React.cloneElement(item.icon, { sx: { mr: 1, color: 'action.active', mt: '4px' } })} {/* Ajuste para alinhar ícone com texto */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'medium', minWidth: '100px' }}> {/* minWidth para consistência */}
                {item.label}:
              </Typography>
            </Box>
            <Typography variant="body1" pl={item.icon ? '32px' : 0} mt={0.5}> {/* Ajuste no padding left se houver ícone */}
              {item.value === null || item.value === undefined || (typeof item.value === 'string' && item.value.trim() === '') ? '—' : item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  });
};


// Seção com título e ícone
const SectionCard: React.FC<{ title: string; icon?: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
  <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, boxShadow: "0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 5px 0 rgba(0,0,0,0.06), 0 1px 10px 0 rgba(0,0,0,0.08)" }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon && React.cloneElement(icon, { sx: { mr: 1.5, color: 'primary.main' } })}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

export default function TransactionDetailsPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Garantir que id é string

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'gerais' | 'detalhes_plataforma'>('gerais');
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    if (id) {
      setLoading(true);
      setError(null);
      fetch(`${process.env.NEXT_PUBLIC_API}/api/transacoes-movimentacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Erro ao buscar dados: ${res.status}`);
          }
          return res.json();
        })
        .then((json: ApiResponse) => {
          if (!json.transacao) {
            console.error("API response missing 'transacao' object:", json);
            throw new Error("Dados da transação incompletos recebidos da API.");
          }
          setApiResponse(json);
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setError(err.message || "Não foi possível carregar os detalhes da transação.");
        })
        .finally(() => setLoading(false));
    } else {
      setError("ID da transação não fornecido.");
      setLoading(false);
    }
  }, [id, router]);

  const transacao = apiResponse?.transacao;
  const isEntrada = transacao?.tipo_operacao === 'entrada';
  const numberColor = isEntrada ? theme.palette.success.main : theme.palette.error.main;

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    const num = parseFloat(String(value));
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {
      console.warn("Invalid date string:", dateString);
      return 'Data inválida';
    }
  };

  const getStatusChipColor = (status?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('pendente') || s.includes('pending')) return 'warning';
    if (['aprovado', 'approved', 'accredited', 'released', 'conciliado', 'concluído'].some(k => s.includes(k))) return 'success';
    if (['rejeitado', 'failed', 'rejected', 'cancelled', 'cancelado', 'erro'].some(k => s.includes(k))) return 'error';
    return 'default';
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} />
      <Typography variant="h6" ml={2}>Carregando dados...</Typography>
    </Box>
  );

  if (error) return (
    <Box textAlign="center" mt={5} component={Paper} p={3} elevation={3} sx={{ maxWidth: 600, margin: 'auto' }}>
      <ErrorOutline color="error" sx={{ fontSize: 60 }} />
      <Typography variant="h5" color="error" mt={2} gutterBottom>
        Erro ao carregar transação
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {error}
      </Typography>
      <Button variant="outlined" onClick={() => router.back()} sx={{ mr: 1 }}>Voltar</Button>
      <Button variant="contained" onClick={() => window.location.reload()}>Tentar Novamente</Button>
    </Box>
  );


  if (!transacao) return (
    <Box textAlign="center" mt={5} component={Paper} p={3} elevation={3} sx={{ maxWidth: 600, margin: 'auto' }}>
      <Info color="info" sx={{ fontSize: 60 }} />
      <Typography variant="h5" color="text.primary" mt={2}>
        Transação não encontrada
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Os dados para esta transação não puderam ser localizados.
      </Typography>
      <Button variant="outlined" onClick={() => router.back()}>Voltar</Button>
    </Box>
  );

  // --- Definição dos blocos de itens para a aba "Informações Gerais" ---
  const idItems: DetailRowItem[] = [
    { icon: <Fingerprint />, label: 'ID Interno', value: transacao.id },
    { icon: <LinkIcon />, label: 'ID Externo', value: transacao.id_transacao_externa },
    { icon: <Description />, label: 'Descrição', value: transacao.descricao },
  ];

  const datasItems: DetailRowItem[] = [
    { icon: <CalendarToday />, label: 'Data da Transação', value: formatDate(transacao.data_transacao) },
    { icon: <CalendarToday />, label: 'Data de Lançamento', value: formatDate(transacao.data_lancamento) },
    { icon: <SwapHoriz />, label: 'Operação', value: <Chip label={transacao.tipo_operacao} color={isEntrada ? 'success' : 'error'} size="small" /> },
  ];

  const valoresItems: DetailRowItem[] = [
    { icon: <AttachMoney />, label: 'Valor Bruto', value: <Typography sx={{ color: numberColor, fontWeight: 'bold' }}>{formatCurrency(transacao.valor)}</Typography> },
    { icon: <AttachMoney />, label: 'Taxas', value: formatCurrency(transacao.valor_taxas) },
    { icon: <AttachMoney />, label: 'Valor Líquido', value: <Typography sx={{ fontWeight: 'bold' }}>{formatCurrency(transacao.valor_liquido)}</Typography> },
  ];

  const metaItems: DetailRowItem[] = [
    { icon: <Label />, label: 'Tipo', value: transacao.tipo ? <Chip label={transacao.tipo} variant="outlined" size="small" /> : undefined },
    { icon: <Category />, label: 'Bandeira/Categoria', value: transacao.categoria ? <Chip label={transacao.categoria} variant="outlined" size="small" /> : undefined },
    { icon: <CheckCircle />, label: 'Status', value: <Chip label={transacao.status} color={getStatusChipColor(transacao.status)} size="small" /> },
  ];

  const conciliacaoPlataformaItems: DetailRowItem[] = [
     { icon: <VerifiedUser />, label: 'Conciliado', value: transacao.conciliado ? 'Sim' : 'Não' },
     { icon: <Payment />, label: 'Plataforma', value: transacao.plataforma },
     { icon: <Source />, label: 'Fonte dos Dados', value: transacao.fonte_dados },
  ];


  const pagadorItems: DetailRowItem[] = [
    { icon: <Person />, label: 'Nome Pagador (Sistema)', value: transacao.nome_pagador },
    { icon: <Email />, label: 'Email Pagador (Sistema)', value: transacao.email_pagador },
    { icon: <Fingerprint />, label: 'Documento Pagador (Sistema)', value: transacao.documento_pagador },
  ];

  const criacaoItems: DetailRowItem[] = [
    { icon: <CalendarToday />, label: 'Criado em', value: formatDate(transacao.created_at) },
    { icon: <CalendarToday />, label: 'Atualizado em', value: formatDate(transacao.updated_at) },
  ];

  // --- Definição dos blocos de itens para a aba "Detalhes da Plataforma" ---
  const { detalhes } = transacao; // Atalho para o objeto de detalhes

  const plataformaIdentificacaoItems: DetailRowItem[] = detalhes ? [
    { icon: <Fingerprint />, label: 'ID Trans. Plataforma', value: detalhes.id },
    { icon: <CheckCircle />, label: 'Status Plataforma', value: <Chip label={detalhes.status} color={getStatusChipColor(detalhes.status)} size="small" /> },
    { icon: <Info />, label: 'Detalhe Status (Plat.)', value: detalhes.status_detail ? <Chip label={detalhes.status_detail} color={getStatusChipColor(detalhes.status_detail)} size="small" /> : undefined },
    { icon: <Description />, label: 'Descrição (Plat.)', value: detalhes.description },
    { icon: <Label />, label: 'Tipo Operação (Plat.)', value: detalhes.operation_type },
  ] : [];

  const plataformaPagadorItems: DetailRowItem[] = detalhes?.payer ? [
    { icon: <Fingerprint />, label: 'ID Pagador (Plat.)', value: detalhes.payer.id },
    { icon: <Email />, label: 'Email Pagador (Plat.)', value: detalhes.payer.email },
    { icon: <Fingerprint />, label: 'Documento (Plat.)', value: detalhes.payer.identification ? `${detalhes.payer.identification.type || ''}: ${detalhes.payer.identification.number || ''}` : undefined },
    { icon: <ContactPhone />, label: 'Telefone (Plat.)', value: detalhes.payer.phone?.number },
    { icon: <Person />, label: 'Nome Pagador (Plat.)', value: `${detalhes.payer.first_name || ''} ${detalhes.payer.last_name || ''}`.trim() || undefined },
  ] : [];

  const plataformaCartaoItems: DetailRowItem[] = detalhes?.card ? [
    { icon: <Person />, label: 'Titular do Cartão', value: detalhes.card.cardholder?.name },
    { icon: <Fingerprint />, label: 'Doc. Titular', value: detalhes.card.cardholder?.identification ? `${detalhes.card.cardholder.identification.type || ''}: ${detalhes.card.cardholder.identification.number || ''}` : undefined },
    { icon: <CreditCard />, label: 'BIN', value: detalhes.card.bin },
    { icon: <CreditCard />, label: 'Final Cartão', value: detalhes.card.last_four_digits ? `**** **** **** ${detalhes.card.last_four_digits}` : undefined },
    { icon: <CalendarToday />, label: 'Validade', value: detalhes.card.expiration_month && detalhes.card.expiration_year ? `${String(detalhes.card.expiration_month).padStart(2, '0')}/${detalhes.card.expiration_year}` : undefined },
    { icon: <Business />, label: 'País Cartão', value: detalhes.card.country },
  ] : [];

  const plataformaPagamentoItems: DetailRowItem[] = detalhes ? [
    { icon: <AttachMoney />, label: 'Moeda', value: detalhes.currency_id },
    { icon: <Receipt />, label: 'Parcelas', value: detalhes.installments },
    { icon: <AttachMoney />, label: 'Valor Transação (Plat.)', value: formatCurrency(detalhes.transaction_amount) },
    { icon: <AttachMoney />, label: 'Valor Líquido (Plat.)', value: formatCurrency(detalhes.transaction_details?.net_received_amount) },
    { icon: <Payment />, label: 'Método Pagamento (Plat.)', value: detalhes.payment_method?.id ? <Chip label={`${detalhes.payment_method.id} (${detalhes.payment_method.type})`} size="small" variant="outlined" /> : undefined },
    { icon: <CalendarToday />, label: 'Data Aprovação (Plat.)', value: formatDate(detalhes.date_approved) },
    { icon: <CalendarToday />, label: 'Liberação Dinheiro (Plat.)', value: formatDate(detalhes.money_release_date) },
    { icon: <CheckCircle />, label: 'Status Liberação (Plat.)', value: detalhes.money_release_status ? <Chip label={detalhes.money_release_status} color={getStatusChipColor(detalhes.money_release_status)} size="small" /> : undefined },
    { icon: <Fingerprint />, label: 'Cód. Autorização (Plat.)', value: detalhes.authorization_code },
    { icon: <Description />, label: 'Descrição Fatura (Plat.)', value: detalhes.statement_descriptor },
  ] : [];

   const plataformaPOIItems: DetailRowItem[] = detalhes?.point_of_interaction ? [
    { icon: <Store />, label: 'Tipo POI', value: detalhes.point_of_interaction.type },
    { icon: <Business />, label: 'Unidade Negócio', value: detalhes.point_of_interaction.business_info?.unit },
    { icon: <Business />, label: 'Subunidade', value: detalhes.point_of_interaction.business_info?.sub_unit },
    { icon: <Info />, label: 'Aplicação POI', value: detalhes.point_of_interaction.application_data?.name },
    { icon: <Info />, label: 'Versão App POI', value: detalhes.point_of_interaction.application_data?.version },
  ] : [];

  const plataformaAdicionalItems: DetailRowItem[] = detalhes?.additional_info?.ip_address ? [
     { icon: <NetworkCheck />, label: 'Endereço IP (Pagador)', value: detalhes.additional_info.ip_address },
  ] : [];


  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }} component={Paper} elevation={1} sx={{ borderRadius: '12px', backgroundColor: theme.palette.background.default }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}
        sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Detalhes da Transação
        </Typography>
        <Chip
          icon={transacao.conciliado ? <VerifiedUser /> : <ErrorOutline />} // Usando ErrorOutline para consistência
          label={transacao.conciliado ? 'Conciliado' : 'Não Conciliado'}
          color={transacao.conciliado ? 'success' : 'warning'}
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v: 'gerais' | 'detalhes_plataforma') => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<Info />} iconPosition="start" label="Informações Gerais" value="gerais" />
        <Tab icon={<Store />} iconPosition="start" label="Detalhes da Plataforma" value="detalhes_plataforma" />
      </Tabs>

      {tab === 'gerais' && (
        <SectionCard title="Resumo da Transação (Sistema)" icon={<Receipt />}>
          {renderRows(idItems)}
          <Divider sx={{ my: 2, display: idItems.length > 0 && datasItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(datasItems)}
          <Divider sx={{ my: 2, display: datasItems.length > 0 && valoresItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(valoresItems)}
          <Divider sx={{ my: 2, display: valoresItems.length > 0 && metaItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(metaItems)}
          <Divider sx={{ my: 2, display: metaItems.length > 0 && conciliacaoPlataformaItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(conciliacaoPlataformaItems)}
          <Divider sx={{ my: 2, display: conciliacaoPlataformaItems.length > 0 && pagadorItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(pagadorItems)}
          <Divider sx={{ my: 2, display: pagadorItems.length > 0 && criacaoItems.length > 0 ? 'block' : 'none' }} />
          {renderRows(criacaoItems)}
        </SectionCard>
      )}

      {tab === 'detalhes_plataforma' && detalhes && (
        <>
          <SectionCard title="Identificação (Plataforma)" icon={<Store />}>
            {renderRows(plataformaIdentificacaoItems)}
          </SectionCard>

          {detalhes.payer && (
            <SectionCard title="Informações do Pagador (Plataforma)" icon={<Person />}>
              {renderRows(plataformaPagadorItems)}
            </SectionCard>
          )}

          {detalhes.card && (
            <SectionCard title="Detalhes do Cartão (Plataforma)" icon={<CreditCard />}>
              {renderRows(plataformaCartaoItems)}
            </SectionCard>
          )}

          <SectionCard title="Detalhes do Pagamento (Plataforma)" icon={<Payment />}>
            {renderRows(plataformaPagamentoItems)}
          </SectionCard>

          {detalhes.additional_info?.items && detalhes.additional_info.items.length > 0 && (
            <SectionCard title="Itens do Pedido (Plataforma)" icon={<ShoppingCart />}>
              {detalhes.additional_info.items.map((item, index) => (
                <Grid item xs={12} key={index} mb={1.5}> {/* Usando Grid item diretamente aqui para estrutura customizada */}
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>{item.title || 'Item sem título'}</Typography>
                    <Typography variant="body2">Quantidade: {item.quantity || 'N/A'}</Typography>
                    <Typography variant="body2">Preço Unitário: {formatCurrency(item.unit_price)}</Typography>
                    {item.description && <Typography variant="caption" display="block" mt={0.5}>Descrição: {item.description}</Typography>}
                  </Paper>
                </Grid>
              ))}
            </SectionCard>
          )}

          {detalhes.point_of_interaction && (
            <SectionCard title="Ponto de Interação (Plataforma)" icon={<Business />}>
              {renderRows(plataformaPOIItems)}
            </SectionCard>
          )}

          {detalhes.additional_info?.ip_address && (
            <SectionCard title="Informações Adicionais (Plataforma)" icon={<NetworkCheck />}>
              {renderRows(plataformaAdicionalItems)}
            </SectionCard>
          )}
        </>
      )}
      
    </Box>
  );
}
