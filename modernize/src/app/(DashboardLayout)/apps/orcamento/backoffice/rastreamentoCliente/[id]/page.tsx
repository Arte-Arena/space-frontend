'use client'
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { Container, Typography, Stepper, Step, StepLabel, Box, Paper } from "@mui/material";
import { IconCoinFilled, IconHomeCheck, IconShoppingCart, IconTruckDelivery, IconTruckLoading } from "@tabler/icons-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import useFetchPedidoOrcamento from "@/app/(DashboardLayout)/apps/orcamento/backoffice/rastreamentoCliente/useGetPedidoOrcamento";
import useFetchOrcamento from "@/app/(DashboardLayout)/apps/orcamento/backoffice/rastreamentoCliente/useGetOrcamento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
}

const RastreamentoClienteScreen = () => {
  // aqui vai ficar a logica das datas de cada coisa, podemos repetir as datas até o separação e transportadora usar o da api de frete.

  const [activeStep, setActiveStep] = useState(3); // Define até qual etapa foi concluída
  const params = useParams();
  const id = params.id;
  const parsedId = Array.isArray(id) ? id[0] : id;
  // fazer as buscas no banco de dados do produto
  // /orcamento/get-orcamento/{id}
  // /pedidos/get-pedido-orcamento/{id}
  // const [dataPedido, setPedido] = useState<Pedido | null>(null);
  // const [dataOrcamento, setOrcamento] = useState<Orcamento | null>(null);

  const { pedido, isLoadingPedido, errorPedido } = useFetchPedidoOrcamento(parsedId);
  const { orcamento, isLoadingOrcamento, errorOrcamento } = useFetchOrcamento(parsedId);

  if (isLoadingPedido || isLoadingOrcamento) return <p>Carregando...</p>;
  if (errorPedido || errorOrcamento) return <p>Erro ao carregar pedido.</p>;

  // é so chamar o objetiro diretamento com "." ou "[]"
  console.dir("Orcamento: " + orcamento);
  console.dir("Pedido: " + pedido);

  const createdAtOrcamento = orcamento?.created_at ? new Date(orcamento.created_at) : null;
  const createdPedido = pedido?.created_at ? new Date(pedido.created_at) : null;  
  const transportadora = orcamento?.opcao_entrega;




  const dateCreatedOrcamento = createdAtOrcamento ? format(createdAtOrcamento, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';
  const dateCreatedPedido = createdPedido ? format(createdPedido, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível';


  const steps = [
    { label: "Pedido realizado", icon: <IconShoppingCart />, date: dateCreatedOrcamento },
    { label: "Pagamento confirmado", icon: <IconCoinFilled />, date: dateCreatedPedido },
    { label: "Pedido em separação", icon: <IconTruckLoading />, date: dateCreatedPedido },
    // proxima data tem que ser na api da transportadora
    { label: "Pedido na transportadora " + transportadora, icon: <IconTruckDelivery />, date: "22/02/2024" },
    { label: "Pedido entregue", icon: <IconHomeCheck />, date: "" },
  ];

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
              Olá, Gabriel! Seu pedido está a caminho.
            </Typography>

            {/* Barra de progresso com as etapas */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={() => step.icon}>
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
                {/* Localização */}
                <Typography variant="body2">
                  {orcamento?.endereco}
                </Typography>
                <Typography variant="body1"><b>codigo de rastreamento:</b> {pedido?.codigo_rastreamento}</Typography>
                {/* tem que ver como formatar pra ficar assim */}
                {/* <Typography variant="body2">
                  Capela do Socorro - <strong>São Paulo</strong> - SP - 04781-000
                </Typography> */}
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
            </Box>
          </Paper>

          {/* Vai ter os metodos de pagamento e informações do pedido */}
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center", border: 0 }}>
            <Box sx={{ mt: 4, textAlign: "left", paddingX: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="error">
                INFORMAÇÕES DE PAGAMENTO
              </Typography>
              {/* aqui vai ficar a table que tem a lista de produtos na pagina de status */}
            </Box>
          </Paper>
        </Container>
      </ParentCard>
    </PageContainer>

  );
};

export default RastreamentoClienteScreen;
