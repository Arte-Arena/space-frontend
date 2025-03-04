'use client'
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { Container, Typography, Stepper, Step, StepLabel, Box, Paper, TableRow, TableCell, Collapse, Table, TableBody, TableHead } from "@mui/material";
import { IconCoinFilled, IconHomeCheck, IconShoppingCart, IconTruckDelivery, IconTruckLoading } from "@tabler/icons-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import useFetchPedidoOrcamento from "@/app/(DashboardLayout)/apps/orcamento/backoffice/components/useGetPedidoOrcamento";
import useFetchOrcamento from "@/app/(DashboardLayout)/apps/orcamento/backoffice/components/useGetOrcamento";
import { addDays, format, isAfter, isEqual, isWeekend } from "date-fns";
import { ptBR } from "date-fns/locale";


interface Produto {
  id: number;
  nome: string;
  peso: string; // Caso o peso seja uma string
  prazo: number;
  preco: number;
  altura: string; // Considerando que altura, largura e comprimento são strings
  largura: string;
  comprimento: string;
  created_at: string | null; // Pode ser null ou uma string
  quantidade: number;
  updated_at: string | null; // Pode ser null ou uma string
}

interface Pedido {
  id: number;
  orcamento_id: number;
  user_id: number | null;
  numero_pedido: string | null;
  data_prevista: string | null;
  pedido_status_id: number | null;
  pedido_tipo_id: number | null;
  pedido_produto_categoria: string | null;
  pedido_material: string | null;
  rolo: string | null;
  medida_linear: string | null;
  prioridade: string | null;
  estagio: string | null;
  situacao: string | null;
  designer_id: number | null;
  observacoes: string | null;
  url_trello: string | null;
  created_at: string;
  updated_at: string;
  codigo_rastreamento: string | null;
}

interface Orcamento {
  id: number;
  user_id: number;
  cliente_octa_number: string;
  nome_cliente: string | null;
  lista_produtos: string | null;
  produtos_brinde: string | null;
  texto_orcamento: string | null;
  endereco_cep: string;
  endereco: string;
  opcao_entrega: string;
  prazo_opcao_entrega: number;
  preco_opcao_entrega: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  brinde: number;
  tipo_desconto: string;
  valor_desconto: number;
  data_antecipa: string;
  taxa_antecipa: string;
  total_orcamento: number;
  prazo_producao: number;
}

const RastreamentoClienteScreen = () => {
  // aqui vai ficar a logica das datas de cada coisa, podemos repetir as datas até o separação e transportadora usar o da api de frete.

  const [activeStep, setActiveStep] = useState(1); // Define até qual etapa foi concluída
  const params = useParams();
  const id = params.id;
  const parsedId = Array.isArray(id) ? id[0] : id;

  const { pedido, isLoadingPedido, errorPedido } = useFetchPedidoOrcamento(parsedId);
  const { orcamento, isLoadingOrcamento, errorOrcamento } = useFetchOrcamento(parsedId);

  if (isLoadingPedido || isLoadingOrcamento) return <p>Carregando...</p>;
  if (errorPedido || errorOrcamento) return <p>Erro ao carregar pedido.</p>;

  // é so chamar o objetiro diretamento com "." ou "[]"
  console.dir("Orcamento: " + orcamento);
  console.dir("Pedido: " + pedido);

  const regexEntrega = /Previsão de Entrega:\s*(.*)/;

  const texto = orcamento?.texto_orcamento;
  console.log(texto);

  const entrega = texto?.match(regexEntrega)?.[1]?.trim() || "Não encontrado";


  const listaProdutos = orcamento?.lista_produtos
    ? (typeof orcamento?.lista_produtos === 'string' ? JSON.parse(orcamento?.lista_produtos) : orcamento?.lista_produtos)
    : [];

  const listaBrindes = orcamento?.produtos_brinde
    ? (typeof orcamento.produtos_brinde === 'string'
      ? JSON.parse(orcamento.produtos_brinde)
      : orcamento.produtos_brinde)
    : [];

  const createdAtOrcamento = orcamento?.created_at ? new Date(orcamento.created_at) : null;
  const createdPedido = pedido?.created_at ? new Date(pedido.created_at) : null;
  const transportadora = orcamento?.opcao_entrega;

  const dateCreatedOrcamento = createdAtOrcamento ? format(createdAtOrcamento, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';
  const dateCreatedPedido = createdPedido ? format(createdPedido, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';

  // const addBusinessDays = (date: Date | null, daysToAdd: number): Date | null => {
  //   if (!date) return null; // Se a data for nula, retorne null imediatamente

  //   let count = 0;
  //   let newDate = date;

  //   // while (count < daysToAdd) {
  //   //   newDate = addDays(newDate, 1);
  //   //   if (!isWeekend(newDate)) {
  //   //     count++;
  //   //   }
  //   // }

  //   return newDate;
  // };


  // const newDate = addBusinessDays(createdPedido, prazoDias);
  const newDate = new Date()
  const dataFormatada = newDate ? format(newDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';

  // const newDateTransportadora = addBusinessDays(createdPedido, prazoDias + 1);
  // const dataFormatadaTransportadora = newDateTransportadora ? format(newDateTransportadora, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';

  const hoje = new Date();
  // const dataHojeFormatada = format(hoje, 'dd/MM/yyyy', { locale: ptBR });


  // colocar o resto da logica de negocio.
  if (createdAtOrcamento && createdPedido) {
    const orcamentoEhMaiorOuIgual = isAfter(hoje, createdAtOrcamento) || isEqual(hoje, createdAtOrcamento);
    const pedidoEhMaiorOuIgual = isAfter(hoje, createdPedido) || isEqual(hoje, createdPedido);

    if (orcamentoEhMaiorOuIgual && !pedidoEhMaiorOuIgual) {
      setActiveStep(1);
    }
    if (pedidoEhMaiorOuIgual && !orcamentoEhMaiorOuIgual) {
      setActiveStep(2);
    }
  }

  console.log(orcamento?.lista_produtos);
  console.log(orcamento?.produtos_brinde);

  const steps = [
    { label: "Pedido realizado", icon: IconShoppingCart, date: dateCreatedOrcamento },
    { label: "Pagamento confirmado", icon: IconCoinFilled, date: dateCreatedPedido },
    { label: "Pedido em Produção até", icon: IconTruckLoading, date: dataFormatada },
    // proxima data tem que ser na api da transportadora
    { label: "Pedido na transportadora", icon: IconTruckDelivery, date: "hoje" }, //dataFormatadaTransportadora
    { label: "Pedido entregue", icon: IconHomeCheck, date: "" },
  ];

  const CustomStepIcon = ({ active = false, completed = false, icon }: { active?: boolean; completed?: boolean; icon: React.ElementType }) => {
    const IconComponent = icon;
    return (
      <IconComponent
        style={{
          color: completed ? "#2ECC71" : active ? "#2ECC71" : "gray",
          fontSize: 24,
        }}
      />
    );
  };

  return (
    <PageContainer title="Rastreamento / Backoffice" description="Rastreamento de pedido">
      <Breadcrumb title="Rastreamento / Backoffice" subtitle="Rastreamento do pedido / Backoffice" />
      <ParentCard title="Rastreamento">
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center", border: 0 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Rastreamento do Pedido
            </Typography>
            {/* nome do cliente, puxar no tiny as infos dele */}
            <Typography variant="body1" sx={{ mb: 4 }}>
              Olá, Seu pedido está a caminho!.
            </Typography>

            {/* Barra de progresso com as etapas */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={(props) => <CustomStepIcon active={props.active !== undefined ? props.active : false} completed={props.completed !== undefined ? props.completed : false} icon={step.icon} />}>
                    <Typography variant="caption">{step.label}</Typography>
                    <Typography variant="caption" sx={{ display: "block", fontSize: "0.75rem" }}>
                      {step.date}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Endereço de Entrega */}
            <Box sx={{ mt: 4, textAlign: "left", paddingX: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="error">
                ENDEREÇO DE ENTREGA
              </Typography>
              <Paper elevation={1} sx={{ p: 2, mt: 1, boxShadow: 'none' }}>

                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  Endereço de entrega
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  {orcamento?.endereco}
                </Typography>

                {/* tem que ver como formatar pra ficar assim */}
                {entrega !== null && (
                  <Typography variant="body2" sx={{ marginY: 1 }}>
                    <b>Entrega via:</b> {transportadora}
                  </Typography>
                )}

                {/* Prazo da Opção de Entrega */}
                <Typography variant="body2" sx={{ marginY: 1 }}>
                  <b>Prazo da Opção de Entrega:</b> {orcamento?.prazo_opcao_entrega}
                </Typography>

                <Typography variant="body2" sx={{ marginY: 1 }}>
                  <b>Codigo de rastreamento:</b> {pedido?.codigo_rastreamento}
                </Typography>

              </Paper>
            </Box>
          </Paper>

          {/* vai ter outro paper pra ficar com a lista de produtos que deve ser exibida da mesma forma que nas tabelas de status */}
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center", border: 0 }}>
            <Box sx={{ mt: 4, textAlign: "left", paddingX: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="error">
                LISTA DE PRODUTOS
              </Typography>
              {/* aqui vai ficar a table que tem a lista de produtos na pagina de status */}

              <TableRow>
                {/* colSpan deve ter o mesmo número que o número de cabeçalhos da tabela, no caso 16 */}
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
                  <Box margin={1}>
                    <Table size="small" aria-label="detalhes">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 'none' }} colSpan={16}>
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                  quantidade:
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                  Preço:
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                  Tamanho:
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                  Peso:
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                  Prazo:
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {listaProdutos.length > 0 ? (
                                listaProdutos.map((produto: Produto, index: number) => (
                                  <TableRow key={produto.id || index}>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                                      {produto.nome}
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                      {produto.quantidade}
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                      {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                      {produto.altura} x {produto.largura} x {produto.comprimento} cm
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                      {produto.peso} kg
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                      {produto.prazo} dias
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                              )}
                            </TableBody>
                          </TableCell>
                        </TableRow>
                        <hr />

                        {orcamento?.produtos_brinde !== null || orcamento?.produtos_brinde !== undefined && (
                          <Box sx={{ mt: 4, textAlign: "left", paddingX: 2 }}>
                            <Typography variant="h6" fontWeight="bold" color="error">
                              BRINDE
                            </Typography>
                            {orcamento?.produtos_brinde !== null && (
                              <TableRow>
                                <TableCell sx={{ border: 'none' }} colSpan={16}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell></TableCell>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                        quantidade:
                                      </TableCell>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                        Preço:
                                      </TableCell>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                        Tamanho:
                                      </TableCell>
                                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                                        Peso:
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {listaBrindes.length > 0 ? (
                                      listaBrindes.map((produto: Produto, index: number) => (
                                        <TableRow key={produto.id || index}>
                                          <TableCell sx={{ fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                                            {produto.nome}
                                          </TableCell>
                                          <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                            {produto.quantidade}
                                          </TableCell>
                                          <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                            {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                          </TableCell>
                                          <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                            {produto.altura} x {produto.largura} x {produto.comprimento} cm
                                          </TableCell>
                                          <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                            {produto.peso} kg
                                          </TableCell>
                                          <TableCell sx={{ padding: '8px', textAlign: 'center' }} colSpan={1}>
                                            {produto.prazo} dias
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                                    )}
                                  </TableBody>
                                </TableCell>
                              </TableRow>
                            )}
                          </Box>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </TableCell>
              </TableRow>

            </Box>
          </Paper>

          {/* Vai ter os metodos de pagamento e informações do pedido */}
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center", border: 0 }}>
            <Box sx={{ mt: 4, textAlign: "left", paddingX: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="error" sx={{ marginBottom: 2 }}>
                INFORMAÇÕES DE PAGAMENTO
              </Typography>
              {/* aqui vai ficar a table que tem a lista de produtos na pagina de status */}
              <Table size="small">

                <TableRow>

                  {orcamento?.prazo_producao !== null && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Prazo de produção:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} colSpan={1}>{orcamento?.prazo_producao} dias úteis</TableCell>
                    </TableRow>
                  )}

                  {orcamento?.preco_opcao_entrega !== undefined && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Frete:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {orcamento?.preco_opcao_entrega}</TableCell>
                    </TableRow>
                  )}

                  {/* Desconto */}
                  {orcamento?.valor_desconto !== null && (
                    <>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                          Desconto:
                        </TableCell>
                        <TableCell sx={{ border: 'none' }} colSpan={1}>Com Desconto</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                          Tipo Descontado:
                        </TableCell>
                        <TableCell sx={{ border: 'none' }} colSpan={1}>{orcamento?.tipo_desconto ?? 'Nenhum'}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                          Valor Descontado:
                        </TableCell>
                        <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {orcamento?.valor_desconto ?? 'Sem Desconto'}</TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Data Antecipação */}
                  {orcamento?.data_antecipa !== null && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Data Antecipação:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} colSpan={1}>{orcamento?.data_antecipa ?? 'Sem Antecipação'}</TableCell>
                    </TableRow>
                  )}

                  {/* Taxa Antecipação */}
                  {orcamento?.taxa_antecipa !== null && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Taxa Antecipação:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {orcamento?.taxa_antecipa ?? 'Sem Taxa de Antecipação'}</TableCell>
                    </TableRow>
                  )}

                  {/* Total Orçamento */}
                  {orcamento?.total_orcamento !== null && (
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none' }}>
                        Total Orçamento:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} colSpan={1}>R$ {orcamento?.total_orcamento ?? 'Sem total Definido'}</TableCell>
                    </TableRow>
                  )}
                </TableRow>
              </Table>
            </Box>
          </Paper>

        </Container>
      </ParentCard>
    </PageContainer>

  );
};

export default RastreamentoClienteScreen;