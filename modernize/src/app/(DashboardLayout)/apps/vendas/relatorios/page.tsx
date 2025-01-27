// RelatoriosVendas.tsx
import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from '@/app/components/shared/ParentCard';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import SalesReportCard from "@/app/components/dashboards/skeleton/SalesReportCard";
import { IconFlagDollar, IconMessage2Dollar, IconReportMoney, IconChecklist, IconReceiptDollar } from "@tabler/icons-react";

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
    icon: <IconChecklist />
  },
  {
    report: "Clientes Atendidos",
    path: "/apps/vendas/relatorios/orcamentos",
    icon: <IconMessage2Dollar />
  },
  {
    report: "Produtos Vendidos por Orçamento",
    path: "/apps/vendas/relatorios/produtos-vendidos-por-orcamento",
    icon: <IconFlagDollar />
  },
  {
    report: "Valores Vendidos por Orcamento",
    path: "/apps/vendas/relatorios/valores-vendidos-por-orcamento",
    icon: <IconReceiptDollar />
  },
  {
    report: "Valores Vendidos por Produto",
    path: "/apps/vendas/relatorios/valores-vendidos-por-produto",
    icon: <IconReceiptDollar />
  },
  {
    report: "Valores Vendidos (Últimos 7 dias)",
    path: "/apps/vendas/relatorios/valores-vendidos-ultimos-7-dias",
    icon: <IconReceiptDollar />
  },
  {
    report: "Produtos Vendidos (Últimos 7 dias)",
    path: "/apps/vendas/relatorios/produtos-vendidos-ultimos-7-dias",
    icon: <IconReceiptDollar />
  }
];

const RelatoriosVendas = (): React.ReactElement => {
  return (
    <PageContainer title="Vendas / Relatórios" description="Relatórios de Vendas da Arte Arena">
      <Breadcrumb title="Vendas / Relatórios" subtitle="Visualize os Relatórios de Vendas da Arte Arena / Buscar" />
      <ParentCard title="Relatórios de Vendas">
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