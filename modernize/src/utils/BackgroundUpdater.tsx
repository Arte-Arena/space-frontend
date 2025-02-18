'use client';
import { useEffect } from 'react';

const BackgroundUpdater = () => {

  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataClientes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/clientes-consolidados`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const clientesConsolidados = await response.json();
        localStorage.setItem('clientesConsolidadosOrcamento', JSON.stringify(clientesConsolidados));
        // console.log('clientesConsolidadosOrcamento: ', clientesConsolidados);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    
    fetchDataClientes();
    
    const intervalIdClientes = setInterval(fetchDataClientes, 900000);
    return () => clearInterval(intervalIdClientes);
  }, []);
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataProdutos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/produto-orcamento-consolidado`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const produtosConsolidadosOrcamento = await response.json();
        localStorage.setItem('produtosConsolidadosOrcamento', JSON.stringify(produtosConsolidadosOrcamento));
        // console.log('produtosConsolidadosOrcamento: ', produtosConsolidadosOrcamento);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDataProdutos();

    const intervalId = setInterval(fetchDataProdutos, 900000);
    return () => clearInterval(intervalId);
  }, []);

  return null;
}

export default BackgroundUpdater;