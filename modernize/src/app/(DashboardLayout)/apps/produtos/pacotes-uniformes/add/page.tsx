'use client'
import ProdutoPacoteUniformeForm from "@/app/(DashboardLayout)/apps/produtos/pacotes-uniformes/ProdutoPacoteUniformeForm";
import ProdutoPacoteUniforme from '../types';

export default function ProdutosPacotesUniformesAddScreen() {

  function handleAdd(data: ProdutoPacoteUniforme) {
    console.log("Pacote criado:", data);
    // Aqui, você pode enviar a atualização para a API
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Adicionar Novo Pacote de Uniformes</h2>
      <ProdutoPacoteUniformeForm onSubmit={handleAdd} />
    </div>
  );

}