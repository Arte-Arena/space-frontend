import { Box, Grid, Typography } from "@mui/material";
import { Produto } from "./types";
import formatLabel from "./formatedLabel";

function SectionCard({
  title,
  produto,
  fields
}: {
  title: string;
  produto: Produto;
  fields: Array<keyof Produto>;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>{title}</Typography>
      <Box>
        <Box>
          <Grid container spacing={2}>
            {fields.map(field => (
              <Grid item xs={12} sm={6} md={3} key={field}>
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                  {formatLabel(field)}
                </Typography>
                <Typography variant="subtitle1">
                  {produto[field] ?? '-'}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
export default SectionCard;
