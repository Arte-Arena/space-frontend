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
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDataProdutos();

    const intervalId = setInterval(fetchDataProdutos, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataMaterials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/material`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const materiais = await response.json();
        localStorage.setItem('materiais', JSON.stringify(materiais.data));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDataMaterials();

    const intervalId = setInterval(fetchDataMaterials, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDesigners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user-role/get-users-by-role?role=Designer`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const designers = await response.json();
        localStorage.setItem('designers', JSON.stringify(designers));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDesigners();

    const intervalId = setInterval(fetchDesigners, 900000);
    return () => clearInterval(intervalId);
  }, []);
  

  return null;
}

export default BackgroundUpdater;