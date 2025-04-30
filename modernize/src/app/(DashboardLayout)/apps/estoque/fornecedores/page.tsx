import FornecedoresForm from '@/app/(DashboardLayout)/apps/estoque/fornecedores/components/FornecedoresForm';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

export default function EstoqueScreen() {
  return (
    <PageContainer title="Estoque" description="Estoque">
      <Breadcrumb title="Estoque" subtitle='Estoque' />
      <FornecedoresForm />
    </PageContainer>
  );
}
