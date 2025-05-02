import FornecedoresForm from '@/app/(DashboardLayout)/apps/estoque/fornecedores/components/FornecedoresForm';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

export default function FornecedoresEditScreen() {
  return (
    <PageContainer title="Editar Fornecedores" description="Editar Fornecedores">
      <Breadcrumb title="Editar Fornecedores" subtitle='Editar Fornecedores' />
      <FornecedoresForm />
    </PageContainer>
  );
}
