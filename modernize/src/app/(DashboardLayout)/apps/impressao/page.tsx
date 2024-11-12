import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const ImpressaoScreen = () => {
  const rows = [
    {
      pedido: 'Pedido 1',
      dataPrevista: '01/01/2023',
      tiposProdutos: 'Produtos A',
      material: 'Material X',
      medidaLinear: '100m',
      designer: 'Designer 1',
      status: 'Aberto',
      tipoPedido: 'Pedido de Impressão',
    },
    // Add more rows as needed
  ];

  return (
    <PageContainer title="Contas a Pagar e a Receber / Adicionar" description="Contas a Pagar e a Receber da Arte Arena">
      <Breadcrumb title="Contas a Pagar e a Receber / Adicionar" subtitle="Gerencie as contas a pagar e a receber da Arte Arena / Adicionar" />
      <ParentCard title="Impressão" >
        <div>
          Impressão
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pedido</TableCell>
                  <TableCell>Data Prevista</TableCell>
                  <TableCell>Tipos de Produtos</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Medida Linear</TableCell>
                  <TableCell>Designer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tipo de Pedido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.pedido}>
                    <TableCell>{row.pedido}</TableCell>
                    <TableCell>{row.dataPrevista}</TableCell>
                    <TableCell>{row.tiposProdutos}</TableCell>
                    <TableCell>{row.material}</TableCell>
                    <TableCell>{row.medidaLinear}</TableCell>
                    <TableCell>{row.designer}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.tipoPedido}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </ParentCard>
    </PageContainer>
  );
};

export default ImpressaoScreen;