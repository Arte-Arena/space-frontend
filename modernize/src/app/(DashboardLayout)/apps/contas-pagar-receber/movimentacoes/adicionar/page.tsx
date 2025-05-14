'use client';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import FormMovimentacoes from '../components/movimentacoesForm';
import ParentCard from '@/app/components/shared/ParentCard';
import { useRouter } from 'next/navigation';

const AdicionarMovimentacaoScreen = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    router.push('/login');
    return null;
  }
  
  return (
    <PageContainer title="Nova Conta" description="Criar ou editar conta">
      <Breadcrumb title="Nova Conta" subtitle="Gerenciar contas" />
      <ParentCard title="Formulário de Conta">
        <FormMovimentacoes  />
      </ParentCard>
    </PageContainer>
  );
};

export default AdicionarMovimentacaoScreen;