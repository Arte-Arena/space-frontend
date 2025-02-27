'use client'
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { Container, Typography, Stepper, Step, StepLabel, Box, Paper } from "@mui/material";
import { IconCoinFilled, IconHomeCheck, IconShoppingCart, IconTruckDelivery, IconTruckLoading } from "@tabler/icons-react";
import { useState } from "react";

const RastreamentoClienteScreen = () => {
  // aqui vai ficar a logica das datas de cada coisa, podemos repetir as datas até o separação e transportadora usar o da api de frete.
  const steps = [
    { label: "Pedido realizado", icon: <IconShoppingCart />, date: "21/02/2024" },
    { label: "Pagamento confirmado", icon: <IconCoinFilled />, date: "21/02/2024" },
    { label: "Pedido em separação", icon: <IconTruckLoading />, date: "21/02/2024" },
    { label: "Pedido na transportadora", icon: <IconTruckDelivery />, date: "22/02/2024" },
    { label: "Pedido entregue", icon: <IconHomeCheck />, date: "" },
  ];
  const [activeStep, setActiveStep] = useState(3); // Define até qual etapa foi concluída


  return (
    <PageContainer title="Rastreamento / Backoffice" description="Rastreamento de pedido">
      <Breadcrumb title="Rastreamento / Backoffice" subtitle="Rastreamento do pedido / Backoffice" />
      <ParentCard title="Rastreamento">
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center",  border: 0}}>
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
            <Box sx={{ mt: 4, textAlign: "left",paddingX: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="error">
                ENDEREÇO DE ENTREGA
              </Typography>
              <Paper elevation={1} sx={{ p: 2, mt: 1, boxShadow: 'none' }}>
                <Typography variant="body1">Minha casa</Typography> 
                {/* Localização */}
                <Typography variant="body2">
                  Avenida Doutor Luís Arrobas Martins, 335
                </Typography>
                {/* tem que ver como formatar pra ficar assim */}
                <Typography variant="body2">
                  Capela do Socorro - <strong>São Paulo</strong> - SP - 04781-000
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Container>
      </ParentCard>
    </PageContainer>

  );
};

export default RastreamentoClienteScreen;
