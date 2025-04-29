import { Box, Divider, Grid, Typography } from "@mui/material";
import { Produto } from "./types";

function DadosGerais({ produto }: { produto: Produto }) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle2" color="textSecondary">Descrição</Typography>
          <Typography variant="body1">{produto.nome ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">Código (SKU)</Typography>
          <Typography variant="body1">{produto.codigo ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle2" color="textSecondary">Origem</Typography>
          <Typography variant="body1">{produto.origem ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">Tipo</Typography>
          <Typography variant="body1">{produto.tipo ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">NCM</Typography>
          <Typography variant="body1">{produto.ncm ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">GTIN/EAN</Typography>
          <Typography variant="body1">{produto.gtin ?? '-'}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">Preço de venda</Typography>
          <Typography variant="body1">
            {produto.preco != null
              ? `R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}`
              : '-'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">Preço promocional</Typography>
          <Typography variant="body1">
            {produto.preco_promocional != null
              ? `R$ ${Number(produto.preco_promocional).toFixed(2).replace('.', ',')}`
              : '-'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">Unidade</Typography>
          <Typography variant="body1">{produto.unidade ?? '-'}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DadosGerais;