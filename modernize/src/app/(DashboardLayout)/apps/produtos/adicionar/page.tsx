import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import { Box } from '@mui/material'
import { NextPage } from 'next'
import ProdutoForm from '../components/produtosForm'

const AdicionarProduto: NextPage = () => {
  return (
    <PageContainer title='Adicionar Produto' description='Adicionar Produto'>
      <Breadcrumb title="Adicionar Produto" />
      <ParentCard title="Adicionar Produto">
        <>
          <ProdutoForm />
        </>
      </ParentCard>
    </PageContainer>
  )
}

export default AdicionarProduto
