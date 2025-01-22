// RelatoriosVendas.tsx
import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from '@/app/components/shared/ParentCard';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import SalesReportCard, { SalesReportCardProps } from "@/app/components/dashboards/skeleton/SalesReportCard";
import { IconReportMoney } from "@tabler/icons-react";

interface Report {
  report: string;
  path: string;
  icon: React.ReactNode;
}

const reports: Report[] = [
  {
    report: "Quantidade de Orcamentos",
    path: "/apps/vendas/relatorios/orcamentos",
    icon: <IconReportMoney />
  },
  {
    report: "Quantidade de Orçamentos Aprovados",
    path: "/apps/vendas/relatorios/orcamentos-aprovados",
    icon: <IconReportMoney />
  },
  {
    report: "Clientes Atendidos",
    path: "/apps/vendas/relatorios/orcamentos",
    icon: <IconReportMoney />
  },
  {
    report: "Produtos Vendidos",
    path: "/apps/vendas/relatorios/produtos-vendidos",
    icon: <IconReportMoney />
  },
  {
    report: "Valores Vendidos",
    path: "/apps/vendas/relatorios/valores-vendidos",
    icon: <IconReportMoney />
  }
];

const RelatoriosVendas = (): React.ReactElement => {
  return (
    <PageContainer title="Orçamento / Buscar" description="Buscar Orçamento da Arte Arena">
      <Breadcrumb title="Orçamento / Buscar" subtitle="Gerencie os Orçamentos da Arte Arena / Buscar" />
      <ParentCard title="Buscar Orçamento">
        <>
          <h1>Relatórios</h1>
          <div>
            {reports.map((item, index) => (
              <SalesReportCard
                key={index}
                icon={item.icon}
                title={item.report}
                link={item.path}
              />
            ))}
          </div>
        </>
      </ParentCard>
    </PageContainer>
  );
};

export default RelatoriosVendas;