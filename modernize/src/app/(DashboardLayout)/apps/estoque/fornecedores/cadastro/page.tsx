import { GetServerSideProps } from 'next';
import FornecedoresForm from '@/app/(DashboardLayout)/apps/estoque/fornecedores/components/FornecedoresForm';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

export default function FornecedoresCadastroPage() {
  return (
    <PageContainer title="Cadastro de Fornecedores" description="Cadastro de Fornecedores">
      <Breadcrumb title="Cadastro de Fornecedores" subtitle='Cadastro de Fornecedores' />
      <FornecedoresForm />
    </PageContainer>
  );
}
