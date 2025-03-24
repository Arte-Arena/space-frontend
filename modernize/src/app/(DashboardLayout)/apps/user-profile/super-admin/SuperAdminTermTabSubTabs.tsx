"use client";

import * as React from "react";
import { Box, Slider, TextField, Button, Typography, Stack } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";

const SuperAdminTermTabSubTabs = () => {
  const [diasMenos, setDiasMenos] = React.useState(5);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setDiasMenos(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(event.target.value), 1), 30);
    setDiasMenos(value);
  };

  const handleSave = () => {
    console.log(`Reduzindo ${diasMenos} dias das datas de produção.`);
    // Aqui você pode fazer uma chamada à API ou atualizar o estado global.

    
  };

  return (
    <ChildCard>
      <Box p={3} sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="h5" gutterBottom sx={{
          color: 'primary.main',
          fontWeight: 600,
          mb: 1,
          textAlign: 'center'
        }}>
          Ajustar Redução de Dias na Produção
        </Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', mb:0 }}>
          Apenas para as telas de
        </Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'center', mb:4, fontWeight: 'bold' }}>
          Arte-Final | Impressão | Confecção 
        </Typography>


        <Stack spacing={3}>
          <Box sx={{ px: 2 }}>
            <Slider
              value={diasMenos}
              onChange={handleSliderChange}
              min={1}
              max={15}
              step={1}
              marks
              sx={{
                color: 'secondary.main',
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  backgroundColor: '#fff',
                  border: '3px solid currentColor',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(100, 108, 255, 0.16)',
                  },
                },
                '& .MuiSlider-valueLabel': {
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'common.white',
                  backgroundColor: 'secondary.main',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  '&:before': {
                    display: 'none',
                  },
                },
                '& .MuiSlider-markLabel': {
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  mt: 1
                }
              }}
            />
          </Box>

          <TextField
            label="Dias a Subtrair"
            type="number"
            value={diasMenos}
            onChange={handleInputChange}
            inputProps={{
              min: 1,
              max: 30,
              style: { textAlign: 'center' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: 'secondary.main',
                  borderWidth: 2
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'secondary.main'
              },
              MozAppearance: 'textfield'
            }}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: 'secondary.main',
              color: 'common.white',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'secondary.dark',
                boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)'
              }
            }}
          >
            Salvar Ajuste
          </Button>
        </Stack>
      </Box>
    </ChildCard>
  );
};

export default SuperAdminTermTabSubTabs;
