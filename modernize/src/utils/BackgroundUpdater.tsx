'use client';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import getBrazilTime from "@/utils/brazilTime";

const BackgroundUpdater = () => {

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataConfigs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const configs = await response.json();
        localStorage.setItem('configs', JSON.stringify(configs));
      } catch (error) {
        console.error('Erro ao buscar dados de get-config:', error);
      }
    };
    
    fetchDataConfigs();
    
    const intervalConfigs = setInterval(fetchDataConfigs, 900000);
    return () => clearInterval(intervalConfigs);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataConfigsPrazos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/get-config-prazos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const configsPrazos = await response.json();
        localStorage.setItem('configPrazos', JSON.stringify(configsPrazos));
      } catch (error) {
        console.error('Erro ao buscar dados de get-config-prazos:', error);
      }
    };
    
    fetchDataConfigsPrazos();
    
    const intervalConfigsPrazos = setInterval(fetchDataConfigsPrazos, 900000);
    return () => clearInterval(intervalConfigsPrazos);
  }, []);

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
        console.error('Erro ao buscar dados de clientes-consolidados:', error);
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
        console.error('Erro ao buscar dados de produto-orcamento-consolidado:', error);
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
        console.error('Erro ao buscar dados de material:', error);
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
        console.error('Erro ao buscar dados de designers:', error);
      }
    };

    fetchDesigners();

    const intervalId = setInterval(fetchDesigners, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchVendedores = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/user-role/get-users-by-role?role=Comercial`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const vendedores = await response.json();
        localStorage.setItem('vendedores', JSON.stringify(vendedores));
      } catch (error) {
        console.error('Erro ao buscar dados de vendedores:', error);
      }
    };

    fetchVendedores();

    const intervalId = setInterval(fetchVendedores, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataPedidoStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedido-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const statusPedidos = await response.json();
        localStorage.setItem('pedidosStatus', JSON.stringify(statusPedidos));
      } catch (error) {
        console.error('Erro ao buscar dados de get-pedido-status:', error);
      }
    };

    fetchDataPedidoStatus();

    const intervalId = setInterval(fetchDataPedidoStatus, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const fetchDataPedidoTipos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/get-pedido-tipos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const tiposPedidos = await response.json();
        localStorage.setItem('pedidosTipos', JSON.stringify(tiposPedidos));
      } catch (error) {
        console.error('Erro ao buscar dados de get-pedido-tipos:', error);
      }
    };

    fetchDataPedidoTipos();

    const intervalId = setInterval(fetchDataPedidoTipos, 900000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const today = DateTime.fromJSDate(getBrazilTime());
    const mesAtual = today.month;
    const anoAtual = today.year;

    const fetchFeriados = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/calendar/feriados-ano-mes?ano=${anoAtual}&mes=${mesAtual}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar feriados: ${response.statusText}`);
        }

        const feriadosData = await response.json();
        localStorage.setItem('feriados', JSON.stringify(feriadosData));
      } catch (error) {
        console.error('Erro ao buscar dados dos feriados:', error);
      }
    };

    fetchFeriados();

    const intervalId = setInterval(fetchFeriados, 900000);
    return () => clearInterval(intervalId);
  }, []);


  return null;
}

export default BackgroundUpdater;