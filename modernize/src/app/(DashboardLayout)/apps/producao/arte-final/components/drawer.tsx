import React from "react";
import { Drawer, Box, Typography, IconButton, Card, CardContent, Divider, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ArteFinal, Produto } from "./types";
import { format } from "date-fns";

interface SidePanelProps {
  row: ArteFinal | null;
  openDrawer: boolean;
  onCloseDrawer: () => void;
}


const SidePanel: React.FC<SidePanelProps> = ({ row, openDrawer, onCloseDrawer }) => {
  // console.log('ROW DRAWER: ', row);
  const designers = localStorage.getItem('designers');

  const listaProdutos: Produto[] = row?.lista_produtos
    ? typeof row?.lista_produtos === "string"
      ? JSON.parse(row?.lista_produtos)
      : row?.lista_produtos
    : [];


  // tem que definir aqui o que cada status vai ser em cada row e cada tipo vai ser em cada row.
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
    8: { nome: 'Pendente', fila: 'I' },
    9: { nome: 'Processando', fila: 'I' },
    10: { nome: 'Renderizando', fila: 'I' },
    11: { nome: 'Impresso', fila: 'I' },
    12: { nome: 'Em Impressão', fila: 'I' },
    13: { nome: 'Separação', fila: 'I' },
    14: { nome: 'Em Transporte', fila: 'E' },
    15: { nome: 'Entregue', fila: 'E' },
  } as const;

  const status = pedidoStatus[row?.pedido_status_id as keyof typeof pedidoStatus] || { nome: "Desconhecido", fila: "N/A" };
  const tipo = row?.pedido_tipo_id && pedidoTipos[row?.pedido_tipo_id as keyof typeof pedidoTipos];

  return (
    <Drawer
      anchor="right" // Abre na lateral direita
      open={openDrawer}
      onClose={onCloseDrawer}
      PaperProps={{
        sx: { width: "40vw", padding: 2 }, // Largura de 40% da tela
      }}
    >
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0}>
        <Typography variant="h5" fontWeight="bold">
          Detalhes do Pedido N°{Number(row?.numero_pedido)}
        </Typography>
        <IconButton onClick={onCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{}}>
        {/* Seção de Datas */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📅 Datas</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>
              <strong>Previsão de Entrega:</strong> <span style={{ fontWeight: 500 }}>
                {row?.data_entrega ? format(new Date(row.data_entrega), "dd/MM/yyyy") : "Data não encontrada."}
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

        {/* Detalhes Gerais */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📦 Produtos do Pedido</Typography>
            <Divider sx={{ mb: 1 }} />
            <Table size="small" aria-label="detalhes" >
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: 'none' }} colSpan={4}>
                    <strong>Lista de Produtos</strong>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Nome:
                        </TableCell> */}
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Esboço:
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Quantidade:
                        </TableCell>
                        {/* <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Material:
                        </TableCell> */}
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Medida linear:
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '12px', fontWeight: 'bold', border: 'none', textAlign: 'center' }}>
                          Prazo Producao:
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listaProdutos.length > 0 ? (
                        listaProdutos.map((produto: Produto, index: number) => (
                          <TableRow key={produto.id || index}>
                            <TableCell sx={{ fontSize: '12px', fontWeight: 'bold', padding: '8px' }} colSpan={1}>
                              {produto.nome}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.esboco}
                            </TableCell>
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.quantidade}
                            </TableCell>
                            {/* <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.material}
                              </TableCell> */}
                            <TableCell sx={{ fontSize: '12px', padding: '8px', textAlign: 'center' }} colSpan={1}>
                              {produto.medida_linear}
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

        {/* Detalhes Gerais */}
        {/* <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📦 🏭 Detalhes do Pedido</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>ID: {row?.id}</Typography>
            <Typography>N° Pedido: {Number(row?.numero_pedido)}</Typography>
            <Typography>Orçamento ID: {Number(row?.orcamento_id)}</Typography>
            <Typography>Rolo: {row?.rolo}</Typography>
            <Typography>User ID: {row?.user_id}</Typography>
          </CardContent>
        </Card> */}

        {/* Seção de Status */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📌 Status</Typography>
            <Divider sx={{ mb: 1 }} />
            {/* <Typography>Estágio: {row?.estagio}</Typography> */}
            {/* <Typography>Status: {row?.status}</Typography> */}
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

        {/* Seção de Observações */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">📝 Observações</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography sx={{fontWeight: 500}}>{row?.observacoes || "Nenhuma observação disponível."}</Typography>
          </CardContent>
        </Card>

        {/* URL do Trello */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">🔗 Trello</Typography>
            <Divider sx={{ mb: 1 }} />
            {row?.url_trello ? (
              <a href={row.url_trello} style={{fontWeight: 500}} target="_blank" rel="noopener noreferrer">
                Acessar Trello
              </a>
            ) : (
              <Typography sx={{fontWeight: 500}}>Nenhuma URL disponível.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
};

export default SidePanel;
