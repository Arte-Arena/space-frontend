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
    <PageContainer title="Erros Screen" description="Tela de Erros Screen">
      <Breadcrumb title="Erros Screen" items={BCrumb} />
      
    </PageContainer>
  );
}
