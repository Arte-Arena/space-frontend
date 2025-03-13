import { Box, TextField, Button } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

interface SearchSectionProps {
  budgetId: string;
  error: string;
  isLoading: boolean;
  onSearch: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  budgetId,
  error,
  isLoading,
  onSearch,
  onInputChange,
}) => {
  return (
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2, 
      alignItems: { xs: 'inherit', sm: 'flex-center' }, 
      width: '100%' 
    }}>
      <TextField
        label="ID do Orçamento"
        variant="outlined"
        value={budgetId}
        onChange={onInputChange}
        error={!!error}
        helperText={error}
        sx={{ flex: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSearch}
        startIcon={<IconSearch />}
        disabled={isLoading}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        Buscar
      </Button>
    </Box>
  );
};