import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import AppCard from "@/app/components/shared/AppCard";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Erros",
  },
];

export default function Erros() {
  return (
    <PageContainer title="Tabela de Erros" description="Tabela de Erros">
      <Breadcrumb title="Tabela de Erros" items={BCrumb} />
      
    </PageContainer>
  );
}
