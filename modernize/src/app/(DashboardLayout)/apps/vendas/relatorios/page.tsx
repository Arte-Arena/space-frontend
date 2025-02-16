// RelatoriosVendas.tsx
import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from '@/app/components/shared/ParentCard';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import SalesReportCard from "@/app/components/dashboards/skeleton/SalesReportCard";
import { IconFlagDollar, IconMessage2Dollar, IconReportMoney, IconChecklist, IconReceiptDollar, IconPackageImport, IconChartLine } from "@tabler/icons-react";

interface Report {
  report: string;
  path: string;
  icon: React.ReactNode;
}

const reports: Report[] = [
  {
    report: "Quantidade de Orcamentos",
    path: "/apps/vendas/relatorios/quantidade-orcamentos",
    icon: <IconReportMoney />
  },
  {
    report: "Todos os Orcamentos",
    path: "/apps/vendas/relatorios/orcamentos-todos",
    icon: <IconReportMoney />
  },
  {
    report: "Orçamentos Por Data",
    path: "/apps/vendas/relatorios/quantidade-orcamentos-por-data",
    icon: <IconChartLine />
  },
  {
    report: "Orçamentos Por Data Filtrada",
    path: "/apps/vendas/relatorios/quantidade-orcamentos-por-data-filtrada",
    icon: <IconChartLine />
  },
  {
    report: "Orçamentos Por Status",
    path: "/apps/vendas/relatorios/quantidade-orcamentos-por-status",
    icon: <IconChartLine />
  },
  {
    report: "Quantidade de Orçamentos Aprovados",
    path: "/apps/vendas/relatorios/quantidade-orcamentos-aprovados",
    icon: <IconChecklist />
  },
  {
    report: "Orçamentos Não Aprovados",
    path: "/apps/vendas/relatorios/orcamentos-nao-aprovados",
    icon: <IconReportMoney />
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
  },
  {
    report: "Clientes Atendidos",
    path: "/apps/vendas/relatorios/orcamentos",
    icon: <IconMessage2Dollar />
  },
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