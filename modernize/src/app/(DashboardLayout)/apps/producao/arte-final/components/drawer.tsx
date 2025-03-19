'use client'
import React, { useEffect, useState } from "react";
import { Drawer, Box, Typography, IconButton, Card, CardContent, Divider, Table, TableBody, TableRow, TableCell, TableHead, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ArteFinal, Produto } from "./types";
import { format } from "date-fns";
import { useThemeMode } from "@/utils/useThemeMode";
import trocarMedidaLinear from "./useTrocarMedidaLinear";
import { IconCheck } from "@tabler/icons-react";

interface SidePanelProps {
  row: ArteFinal | null;
  openDrawer: boolean;
  onCloseDrawer: () => void;
  refetch: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ row, openDrawer, onCloseDrawer, refetch }) => {
  const designers = localStorage.getItem('designers');
  const theme = useThemeMode();

  const listaProdutos: Produto[] = row?.lista_produtos
    ? typeof row?.lista_produtos === "string"
      ? JSON.parse(row?.lista_produtos)
      : row?.lista_produtos
    : [];

  const [medidasLineares, setMedidasLineares] = useState<Record<string, number>>({});
  const [produtos, setProdutos] = useState<Produto[]>(listaProdutos); // Estado corrigido para array de produtos
  const [digitando, setDigitando] = useState(false); // Estado para saber se o usuário está digitando

  useEffect(() => {
    setProdutos(listaProdutos);
  }, [row]);

  const parsedDesigners = typeof designers === 'string' ? JSON.parse(designers) : designers;
  const usersMap = new Map(
    Array.isArray(parsedDesigners)
      ? parsedDesigners.map(designer => [designer.id, designer.name])
      : []
  );

  const getUserNameById = (id: number | null | undefined) => {
    return id && usersMap.has(id) ? usersMap.get(id) : "Desconhecido";
  };
  const designerNome = getUserNameById(row?.designer_id);

  const pedidoTipos = {
    1: 'Prazo normal',
    2: 'Antecipação',
    3: 'Faturado',
    4: 'Metade/Metade',
    5: 'Amostra',
  } as const;

  const pedidoStatus = {
    1: { nome: 'Pendente', fila: 'D' },
    2: { nome: 'Em andamento', fila: 'D' },
    3: { nome: 'Arte OK', fila: 'D' },
    4: { nome: 'Em espera', fila: 'D' },
    5: { nome: 'Cor teste', fila: 'D' },
    6: { nome: 'Em espera', fila: 'D' },
    7: { nome: 'Em espera', fila: 'D' },
    8: { nome: 'Pendente', fila: 'I' },
    9: { nome: 'Processando', fila: 'I' },
    10: { nome: 'Renderizando', fila: 'I' },
    11: { nome: 'Impresso', fila: 'I' },
    12: { nome: 'Em Impressão', fila: 'I' },
    13: { nome: 'Separação', fila: 'I' },
    14: { nome: 'prensa/clandra', fila: 'C' },
    15: { nome: 'checagem', fila: 'C' },
    16: { nome: 'corte/preparaçao', fila: 'C' },
    17: { nome: 'prateleriera/pendente', fila: 'C' },
    18: { nome: 'costura/confeccao', fila: 'C' },
    19: { nome: 'conferencia final', fila: 'C' },
    20: { nome: 'finalizado', fila: 'C' },
    21: { nome: 'reposição', fila: 'C' },
  } as const;

  const status = pedidoStatus[row?.pedido_status_id as keyof typeof pedidoStatus] || { nome: "Desconhecido", fila: "N/A" };
  const tipo = row?.pedido_tipo_id && pedidoTipos[row?.pedido_tipo_id as keyof typeof pedidoTipos];

  // const handleMedidaLinearChange = (produto: Produto, novaMedidaLinear: number) => {
  //   setMedidasLineares(prevState => ({
  //     ...prevState,
  //     [produto.uid]: novaMedidaLinear,
  //   }));
  // };

  // const atualizarProduto = (produtoAtualizado: Produto) => {
  //   setProdutos((prevProdutos) =>
  //     prevProdutos.map((p) => (p.uid === produtoAtualizado.uid ? produtoAtualizado : p))
  //   );
  // };

  const handletrocarMedidaLinear = async (uid: number | null, medidasLineares: Record<string, number>, id: number) => {
    try {
      const response = await trocarMedidaLinear(id, uid, medidasLineares, refetch);
      if (response) {
        console.log("Medida linear atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar medida linear:", error);
    }
  };

  const handleMedidaLinearChange = (produto: Produto, novaMedidaLinear: number) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => 
        p.uid === produto.uid ? { ...p, medida_linear: novaMedidaLinear } : p
      )
    );

    const medidasAtualizadas = {
      ...medidasLineares,
      [String(produto.uid)]: novaMedidaLinear,
    };
    setMedidasLineares(medidasAtualizadas);

    // Define um timeout para chamar a API após 1 segundo de inatividade
    setDigitando(true);
    setDigitando(false);

    if (row?.id !== undefined) {
      handletrocarMedidaLinear(produto.uid ?? null, medidasLineares, row.id);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={onCloseDrawer}
      PaperProps={{
        sx: { width: "40vw", padding: 2 },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0}>
        <Typography variant="h5" fontWeight="bold">
          Detalhes do Pedido N°{Number(row?.numero_pedido)}
        </Typography>
        <IconButton onClick={onCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📅 Datas</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>
              <strong>Previsão de Entrega:</strong> <span style={{ fontWeight: 500 }}>
                {row?.data_prevista ? format(new Date(row.data_prevista), "dd/MM/yyyy") : "Data não encontrada."}
              </span>
            </Typography>
            <Typography>
              <strong>Criação do Pedido:</strong> <span style={{ fontWeight: 500 }}>
                {row?.created_at ? format(new Date(row.created_at), "dd/MM/yyyy") : "Data inválida"}
              </span>
            </Typography>
            <Typography>
              <strong>Última Atualização:</strong> <span style={{ fontWeight: 500 }}>
                {row?.updated_at ? format(new Date(row.updated_at), "dd/MM/yyyy") : "Data inválida"}
              </span>
            </Typography>
            <Typography>
              <strong>Prazo de Arte:</strong> <span style={{ fontWeight: 500 }}>{row?.prazo_arte_final ? format(new Date(row?.prazo_arte_final), "dd/MM/yyyy") : "Data inválida"}</span>
            </Typography>
            <Typography>
              <strong>Prazo de Confecção:</strong> <span style={{ fontWeight: 500 }}>{row?.prazo_confeccao ? format(new Date(row?.prazo_confeccao), "dd/MM/yyyy") : "Data inválida"}</span>
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📦 Produtos do Pedido</Typography>
            <Divider sx={{ mb: 1 }} />
            <Table size="small" aria-label="detalhes">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: 'none' }} colSpan={4}>
                    <strong>Lista de Produtos</strong>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Esboço:
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Quantidade:
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Medida linear:
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Prazo Producao:
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {produtos.length > 0 ? (
                        produtos.map((produto: Produto, index: number) => (
                          <TableRow key={produto.uid || index}>
                            <TableCell sx={{ fontSize: '12px', fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                              {produto.nome}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.esboco}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.quantidade}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center', display: 'flex' }} colSpan={1}>
                              <TextField
                                key={produto.uid}
                                type="number"
                                size="small"
                                variant="outlined"
                                value={medidasLineares[String(produto.uid)] || produto.medida_linear}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const novaMedidaLinear = Number(e.target.value);
                                  handleMedidaLinearChange(produto, novaMedidaLinear);
                                }}
                                sx={{
                                  minWidth: '50px',
                                  '& input': {
                                    fontSize: '14px',
                                  },
                                  '& input[type=number]': {
                                    MozAppearance: 'textfield',
                                    WebkitAppearance: 'textfield',
                                  },
                                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                  }
                                }}
                                InputProps={{
                                  inputProps: {
                                    min: 0,
                                    step: 'any',
                                  }
                                }}
                              />
                              <Button
                                onClick={() => handleMedidaLinearChange(produto, produto.medida_linear || medidasLineares[String(produto.uid)])}
                                sx={{ ml: 1, padding: 0 }}
                              >
                                <IconCheck size={16} />
                              </Button>
                             
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.prazo}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">Nenhum produto disponível</Typography>
                      )}
                    </TableBody>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📌 Status</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>
              <strong>Designer alocado:</strong> <span style={{ fontWeight: 500 }}>{designerNome}</span>
            </Typography>
            <Typography>
              <strong>Status do Pedido:</strong> <span style={{ fontWeight: 500 }}>{status?.nome}</span>
            </Typography>
            <Typography>
              <strong>Fila do Pedido:</strong> <span style={{ fontWeight: 500 }}>{status.fila === 'D' ? "Design" : "Impressão"}</span>
            </Typography>
            <Typography>
              <strong>Tipo do Pedido:</strong> <span style={{ fontWeight: 500 }}>{tipo}</span>
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📝 Observações</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography sx={{ fontWeight: 500 }}>{row?.observacoes || "Nenhuma observação disponível."}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">🔗 Trello</Typography>
            <Divider sx={{ mb: 1 }} />
            {row?.url_trello ? (
              <a href={row.url_trello} style={{ fontWeight: 500, color: theme === 'dark' ? 'rgb(0, 255, 255)' : 'blue' }} target="_blank" rel="noopener noreferrer">
                Acessar Trello
              </a>
            ) : (
              <Typography sx={{ fontWeight: 500, color: theme === 'dark' ? 'rgb(0, 255, 255)' : 'blue' }}>Nenhuma URL disponível.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Drawer >
  );
};

export default SidePanel;