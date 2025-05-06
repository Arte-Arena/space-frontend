'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { Estoque, Variacoes, Fornecedor, Produto } from '../../components/Types';

// Estilizando o componente Tab
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.fontSize,
  marginRight: theme.spacing(1),
  '&:focus': {
    opacity: 1,
  },
}));

// Estilizando o componente Tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Componente para exibir os dados gerais
const DadosGeraisEstoque = ({ estoque }: { estoque: Estoque }) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Nome</Typography>
        <Typography variant="body1">{estoque.nome}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Descrição</Typography>
        <Typography variant="body1">{estoque.descricao}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Quantidade</Typography>
        <Typography variant="body1">{estoque.quantidade}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Estoque Mínimo</Typography>
        <Typography variant="body1">{estoque.estoque_min}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Estoque Máximo</Typography>
        <Typography variant="body1">{estoque.estoque_max}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Unidade de Medida</Typography>
        <Typography variant="body1">{estoque.unidade_medida}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Categoria</Typography>
        <Typography variant="body1">{estoque.categoria}</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Produto Base</Typography>
        <Typography variant="body1">{estoque.produto_table} (ID {estoque.produto_id})</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle2" color="textSecondary">Preço do Produto</Typography>
        <Typography variant="body1">{estoque.preco_produto}</Typography>
      </Grid>
    </Grid>
  </Box>
);

// Componente para exibir as variações
const VariacoesEstoque = ({ variacoes }: { variacoes: Variacoes[] }) => (
  <TableContainer component={Paper} sx={{ p: 3 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          {['Cor', 'Material', 'Tamanhos', 'Franjas', 'Altura', 'Largura', 'Preço'].map(
            (col) => (
              <TableCell key={col} sx={{ fontWeight: 'bold' }}>
                {col}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {variacoes.map((v: Variacoes, i) => (
          <TableRow key={i}>
            <TableCell>{v.color}</TableCell>
            <TableCell>{v.material}</TableCell>
            <TableCell>{v.tamanhos}</TableCell>
            <TableCell>{v.franjas}</TableCell>
            <TableCell>{v.altura}</TableCell>
            <TableCell>{v.largura}</TableCell>
            <TableCell>{v.preco}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const FornecedoresProdutosEstoque = ({ fornecedores, produtos, loadingFornecedores, errorFornecedores, loadingProduto, errorProduto }
  : { fornecedores: Fornecedor[]; produtos: Produto[]; loadingFornecedores: boolean; errorFornecedores: string; loadingProduto: boolean; errorProduto: string }) => {
  const hasFornecedores = fornecedores && fornecedores.length > 0;
  const hasProdutos = produtos && produtos.length > 0;
  const formatNumber = (value: number | string) => {
    const num = Number(value);
    return isNaN(num) ? '-' : num.toFixed(2).replace('.', ',');
  };



  if (loadingProduto || loadingFornecedores) {
    return (
      <Box textAlign="center" sx={{ py: 4 }}>
        <CircularProgress />
        <Typography>Carregando dados...</Typography>
      </Box>
    );
  }



  return (
    <Box>
      {!loadingProduto && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Produtos
          </Typography>
          <Grid container spacing={2}>
            {hasProdutos ? (
              produtos.map((p) => (
                <Grid key={p.id} item xs={12} md={6} lg={4}>
                  <Card sx={{
                    height: '100%',
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2
                  }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">
                        Nome
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {p.nome}
                      </Typography>

                      {p.preco && (
                        <>
                          <Typography variant="subtitle2" color="textSecondary">
                            Preço
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            R$ {formatNumber(p.preco)}
                          </Typography>
                        </>
                      )}
                      {p.prazo && (
                        <>
                          <Typography variant="subtitle2" color="textSecondary">
                            Prazo
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {p.prazo} dias
                          </Typography>
                        </>
                      )}
                      {p.peso && (
                        <>
                          <Typography variant="subtitle2" color="textSecondary">
                            Peso
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {formatNumber(p.peso)} kg
                          </Typography>
                        </>
                      )}
                      {(p.largura || p.altura || p.comprimento) && (
                        <>
                          <Typography variant="subtitle2" color="textSecondary">
                            Dimensões (L×A×C)
                          </Typography>
                          <Typography variant="body1">
                            {formatNumber(p.largura)} × {formatNumber(p.altura)} × {formatNumber(p.comprimento)} cm
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="error">
                  {errorProduto || 'Nenhum produto encontrado.'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Fornecedores
      </Typography>
      <Grid container spacing={2}>
        {fornecedores.length > 0 ? (
          fornecedores.map((f) => (
            <Grid key={f.id} item xs={12} md={6} lg={4}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6">
                  {f.tipo_pessoa === 'J' ? f.razao_social : f.nome_completo}
                </Typography>
                <List sx={{ mt: 2, p: 0 }}>
                  {f.produtos.map((prod) => (
                    <ListItem key={prod.id} sx={{ py: 0.50 }}>
                      <Typography variant="body2" noWrap={true}>
                        • {prod.nome} {prod.quantidade ? " — Qtd: " : ""} {prod.quantidade ? prod.quantidade : ""} {prod.preco ? " — R$ " : ""} {prod.preco ? Number(prod.preco).toFixed(2).replace('.', ',') : ""}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography sx={{ p: 2, mt: 1 }} color="error">
            {errorFornecedores || 'Nenhum fornecedor encontrado.'}
          </Typography>
        )}
      </Grid>
      {!hasFornecedores && !hasProdutos && !loadingFornecedores && !loadingProduto && (
        <Typography>Nenhum fornecedor ou produto encontrado.</Typography>
      )}
    </Box>
  );
};

export default function EstoqueDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const [estoque, setEstoque] = useState<Estoque | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Record<string, any>>({});

  // estados para produtos
  const [produto, setProduto] = useState<Produto[]>([]);
  const [loadingProduto, setLoadingProduto] = useState(false);
  const [errorProduto, setErrorProduto] = useState<string>('');

  // estados para fornecedores
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [errorFornecedores, setErrorFornecedores] = useState<string>('');

  // proteção de rota
  if (!accessToken) {
    router.push('/auth/login');
    return null;
  }

  // Fun o para fazer a requisi o com retry e cache
  const fetchDataWithRetryAndCache = async function <T>(
    url: string,
    config: AxiosRequestConfig = {},
    retryCount = 0
  ): Promise<T> {
    const maxRetries = 3;
    const initialDelay = 500;

    // Inicializa o cache se necessário
    if (!cacheRef.current) cacheRef.current = {};

    // Verifica se a resposta está em cache
    if (cacheRef.current[url]) {
      console.log(`Cache hit for ${url}`);
      return cacheRef.current[url];
    }

    try {
      abortControllerRef.current = new AbortController();
      config.signal = abortControllerRef.current.signal;

      const response = await axios.get<T>(url, config);
      cacheRef.current[url] = response.data;

      return response.data;
    } catch (err: any) {
      if (axios.isCancel(err)) throw err;

      if (err.response?.status === 429 && retryCount < maxRetries) {
        const delay = initialDelay * Math.pow(2, retryCount);
        console.log(`Retrying ${url} after ${delay}ms (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchDataWithRetryAndCache<T>(url, config, retryCount + 1);
      }

      throw err;
    } finally {
      abortControllerRef.current = null;
    }
  };


  // fetch do estoque
  useEffect(() => {
    if (!id) return setLoading(false);
    setLoading(true);
    axios.get<Estoque>(`${process.env.NEXT_PUBLIC_API}/api/estoque/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => setEstoque(res.data))
      .catch(() => setError('Erro ao carregar dados de estoque.'))
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  // fetch dos fornecedores
  useEffect(() => {
    if (!estoque || !estoque.fornecedores) return;
    if (!accessToken) return;

    setLoadingFornecedores(true);
    const promises: Promise<Fornecedor>[] = [];

    estoque.fornecedores.forEach(f => {
      if (f.id === 0) {
        promises.push(
          Promise.resolve({
            id: 0,
            fornecedor_id: 0,
            tipo_pessoa: '',
            nome_completo: f.nome_completo,
            rg: '',
            cpf: '',
            razao_social: '',
            cnpj: '',
            inscricao_estadual: '',
            email: '',
            celular: '',
            cep: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            produtos: [produto[0]],
            created_at: new Date(),
            updated_at: new Date(),
          })
        );
      } else {
        // Buscar do backend
        promises.push(fetchDataWithRetryAndCache<Fornecedor>(
          `${process.env.NEXT_PUBLIC_API}/api/fornecedor/${f.fornecedor_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }));
      }
    });

    Promise.all(promises)
      .then(setFornecedores)
      .catch(err => {
        const msg = err.response?.data
          ? typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data.message)
          : err.message;
        setErrorFornecedores(msg);
      })
      .finally(() => setLoadingFornecedores(false));
  }, [estoque, produto]);


  useEffect(() => {
    if (!estoque) return;
    setLoadingProduto(true);

    const fetchProdutos = async () => {
      try {
        const data = await fetchDataWithRetryAndCache<Produto | Produto[]>(
          `${process.env.NEXT_PUBLIC_API}/api/produto-tipo/${estoque.produto_id}/${estoque.produto_table}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
          }
        );
        const produtosArray = Array.isArray(data) ? data : [data];
        setProduto(produtosArray);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setErrorProduto('Erro ao carregar produtos.' + err);
        }
      } finally {
        setLoadingProduto(false);
      }
    };
    fetchProdutos();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id, accessToken, estoque]);

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }
  if (loading || !estoque) {
    return (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const tabLabels = ['Dados Gerais', 'Variações', 'Fornecedores e Produtos'];

  return (
    <Box sx={{ p: 3, maxWidth: '90%', mx: 'auto' }}>
      <Breadcrumb
        title="Estoque / Detalhes"
        subtitle="Gerencie Itens do Estoque"
      />

      <Typography variant="h4" component="h1" mb={3} sx={{ fontWeight: 'bold' }}>
        Detalhes do Estoque
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 1 }}>
        <StyledTabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          aria-label="estoque tabs"

        >
          {tabLabels.map((label, index) => (
            <StyledTab key={label} label={label} id={`simple-tab-${index}`} />
          ))}
        </StyledTabs>
      </Box>
      {/* Aba Dados Gerais */}
      <TabPanel value={tabIndex} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'semibold' }}>
              Informações Gerais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <DadosGeraisEstoque estoque={estoque} />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Aba Variações */}
      <TabPanel value={tabIndex} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'semibold' }}>
              Variações do Produto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <VariacoesEstoque variacoes={estoque.variacoes} />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Aba Fornecedores e Produtos */}
      <TabPanel value={tabIndex} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" mb={2} sx={{ fontWeight: 'semibold' }}>
              Fornecedores e Produtos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FornecedoresProdutosEstoque
              fornecedores={fornecedores}
              produtos={produto}
              loadingFornecedores={loadingFornecedores}
              errorFornecedores={errorFornecedores}
              loadingProduto={loadingProduto}
              errorProduto={errorProduto}
            />
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}

