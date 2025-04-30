import FornecedoresForm from '@/app/(DashboardLayout)/apps/estoque/fornecedores/components/FornecedoresForm';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

export default function FornecedoresScreen() {
  return (
    <PageContainer title="Fornecedores" description="Fornecedores">
      <Breadcrumb title="Fornecedores" subtitle='Fornecedores' />
      <FornecedoresForm />
    </PageContainer>
  );
}
