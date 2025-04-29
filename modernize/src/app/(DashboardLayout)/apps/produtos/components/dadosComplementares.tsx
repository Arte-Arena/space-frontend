import { Box, Button, Chip, Divider, Grid, Typography } from "@mui/material";
import { Produto } from "./types";

function DadosComplementares({ produto }: { produto: Produto }) {
  const keywords = produto.seo_keywords
    ? String(produto.seo_keywords).split(',').map((t: string) => t.trim())
    : [];

  const imagens = Array.isArray(produto.imagens_externas)
    ? produto.imagens_externas
    : [];

  return (
    <Box>
      {/* Categorização */}
      <Typography variant="subtitle1" gutterBottom>Categorização</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Categoria</Typography>
          <Typography variant="body1">{produto.categoria ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Marca</Typography>
          <Typography variant="body1">{produto.marca ?? '-'}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Descrição complementar */}
      <Typography variant="subtitle1" gutterBottom>Descrição complementar</Typography>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          maxHeight: 200,
          overflowY: 'auto'
        }}
      >
        <Typography variant="body2" whiteSpace="pre-line">
          {produto.descricao_complementar ?? '-'}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Imagens e anexos */}
      <Typography variant="subtitle1" gutterBottom>Imagens e anexos</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1
        }}
      >
        {imagens.map((url, idx) => (
          <Box
            key={idx}
            component="img"
            src={url}
            alt={`Imagem ${idx + 1}`}
            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
          />
        ))}
        <Button variant="contained">Gerenciar imagens</Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Campos adicionais */}
      <Typography variant="subtitle1" gutterBottom>Campos adicionais</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Slug</Typography>
          <Typography variant="body1">{produto.slug ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Keywords</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {keywords.map((kw, i) => (
              <Chip key={i} label={kw} size="small" />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Título para SEO</Typography>
          <Typography variant="body1">{produto.seo_title ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">Descrição para SEO</Typography>
          <Typography variant="body1">{produto.seo_description ?? '-'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="textSecondary">Tags</Typography>
          <Typography variant="body1">{produto.variacoes ?? '-'}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DadosComplementares;

