"use client";
import { useState, useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
  Stack,
  TextField,
  Collapse,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { IconCalendar } from "@tabler/icons-react";

export type PeriodoType =
  | "7dias"
  | "30dias"
  | "90dias"
  | "1ano"
  | "todos"
  | "custom";

interface PeriodoSelectorProps {
  onChange: (periodo: PeriodoType, dataInicio?: Date, dataFim?: Date) => void;
  selectedPeriodo: PeriodoType;
  dataInicio?: Date;
  dataFim?: Date;
}

const PeriodoSelector = ({
  onChange,
  selectedPeriodo,
  dataInicio,
  dataFim,
}: PeriodoSelectorProps) => {
  const [showCustom, setShowCustom] = useState(selectedPeriodo === "custom");
  const [dataInicioTemp, setDataInicioTemp] = useState<Date | null>(
    dataInicio || null,
  );
  const [dataFimTemp, setDataFimTemp] = useState<Date | null>(dataFim || null);

  useEffect(() => {
    if (selectedPeriodo === "custom") {
      setDataInicioTemp(dataInicio || null);
      setDataFimTemp(dataFim || null);
    }
  }, [selectedPeriodo, dataInicio, dataFim]);

  const handlePeriodoChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriodo: PeriodoType | null,
  ) => {
    if (newPeriodo !== null) {
      if (newPeriodo === "custom") {
        setShowCustom(true);
        onChange(
          "custom",
          dataInicioTemp || undefined,
          dataFimTemp || undefined,
        );
      } else {
        setShowCustom(false);
        onChange(newPeriodo);
      }
    }
  };

  const handleCustomDateChange = () => {
    if (dataInicioTemp && dataFimTemp) {
      onChange("custom", dataInicioTemp, dataFimTemp);
    }
  };

  useEffect(() => {
    if (showCustom && dataInicioTemp && dataFimTemp) {
      handleCustomDateChange();
    }
  }, [dataInicioTemp, dataFimTemp]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: showCustom ? 2 : 3,
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="500"
            color="textSecondary"
          >
            Período:
          </Typography>
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <ToggleButtonGroup
              value={selectedPeriodo}
              exclusive
              onChange={handlePeriodoChange}
              aria-label="período de tempo"
              size="small"
            >
              <ToggleButton value="7dias" aria-label="últimos 7 dias">
                7 dias
              </ToggleButton>
              <ToggleButton value="30dias" aria-label="últimos 30 dias">
                30 dias
              </ToggleButton>
              <ToggleButton value="90dias" aria-label="últimos 90 dias">
                90 dias
              </ToggleButton>
              <ToggleButton value="1ano" aria-label="último ano">
                1 ano
              </ToggleButton>
              <ToggleButton value="todos" aria-label="todos os períodos">
                Todos
              </ToggleButton>
              <ToggleButton value="custom" aria-label="período personalizado">
                <IconCalendar size={18} style={{ marginRight: "4px" }} />
                Personalizado
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Collapse in={showCustom}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 1,
              background: "transparent",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <DatePicker
                label="Data Inicial"
                value={dataInicioTemp}
                onChange={(newValue) => setDataInicioTemp(newValue)}
                renderInput={(params) => <TextField size="small" {...params} />}
                inputFormat="dd/MM/yyyy"
              />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mx: { xs: 0, sm: 1 } }}
              >
                até
              </Typography>
              <DatePicker
                label="Data Final"
                value={dataFimTemp}
                onChange={(newValue) => setDataFimTemp(newValue)}
                minDate={dataInicioTemp || undefined}
                renderInput={(params) => <TextField size="small" {...params} />}
                inputFormat="dd/MM/yyyy"
              />
            </Stack>
          </Paper>
        </Collapse>
      </Box>
    </LocalizationProvider>
  );
};

export default PeriodoSelector;
