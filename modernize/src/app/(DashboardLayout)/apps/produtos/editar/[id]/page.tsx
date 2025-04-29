import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/app/components/container/PageContainer'
import ParentCard from '@/app/components/shared/ParentCard'
import { Box } from '@mui/material'
import { NextPage } from 'next'
import ProdutoForm from '../../components/produtosForm'

const EditarProduto: NextPage = () => {
  return (
    <PageContainer title='Editar Produto' description='Editar Produto'>
      <Breadcrumb title="Editar Produto" />
      <ParentCard title="Editar Produto">
        <>
          <ProdutoForm />
        </>
      </ParentCard>
    </PageContainer>
  )
}

export default EditarProduto
