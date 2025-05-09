"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Divider,
  Button,
  IconButton,
  SelectChangeEvent,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Modal,
} from "@mui/material";
import {
  IconFilter,
  IconX,
  IconSortAscendingNumbers,
  IconSortDescendingNumbers,
  IconSortAZ,
  IconCurrencyReal,
} from "@tabler/icons-react";

type StatusType =
  | "all"
  | "novo"
  | "em andamento"
  | "aprovado"
  | "convertido"
  | "perdido";
type ClientType = "all" | "b2b" | "b2c";
type SortType = "none" | "asc" | "desc";

interface LeadFilterProps {
  onFilter: (filters: {
    status: StatusType | null;
    budgetRange: [number, number] | null;
    clientType: ClientType | null;
    budgetSort: SortType;
  }) => void;
  onClearFilters: () => void;
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const LeadFilter: React.FC<LeadFilterProps> = ({
  onFilter,
  onClearFilters,
  activeFilters,
  setActiveFilters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("all");
  const [clientType, setClientType] = useState<ClientType>("all");
  const [budgetMin, setBudgetMin] = useState<string>("0");
  const [budgetMax, setBudgetMax] = useState<string>("100000");
  const [budgetMinError, setBudgetMinError] = useState<string>("");
  const [budgetMaxError, setBudgetMaxError] = useState<string>("");
  const [budgetSort, setBudgetSort] = useState<SortType>("none");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatusChange = (event: SelectChangeEvent<StatusType>) => {
    setStatus(event.target.value as StatusType);
  };

  const handleClientTypeChange = (event: SelectChangeEvent<ClientType>) => {
    setClientType(event.target.value as ClientType);
  };

  const handleBudgetMinChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "");
    setBudgetMin(value);
    validateBudgetRange(value, budgetMax);
  };

  const handleBudgetMaxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "");
    setBudgetMax(value);
    validateBudgetRange(budgetMin, value);
  };

  const validateBudgetRange = (min: string, max: string) => {
    const minValue = parseInt(min || "0");
    const maxValue = parseInt(max || "0");

    let minError = "";
    let maxError = "";

    if (minValue < 0) {
      minError = "Valor mínimo não pode ser negativo";
    }

    if (maxValue < minValue) {
      maxError = "Valor máximo deve ser maior que o mínimo";
    }

    setBudgetMinError(minError);
    setBudgetMaxError(maxError);
  };

  const handleBudgetSortChange = (
    event: React.MouseEvent<HTMLElement>,
    newSort: SortType | null,
  ) => {
    const sort = newSort || "none";
    setBudgetSort(sort);
  };

  const updateActiveFilters = () => {
    let newActiveFilters: string[] = [];

    if (status !== "all") {
      newActiveFilters.push(`status:${status}`);
    }

    if (clientType !== "all") {
      newActiveFilters.push(`clientType:${clientType}`);
    }

    const minValue = parseInt(budgetMin || "0");
    const maxValue = parseInt(budgetMax || "100000");
    if (minValue >= 0) {
      newActiveFilters.push(`budgetRange:${minValue}-${maxValue}`);
    }

    // Add budget sort filter if not default
    if (budgetSort !== "none") {
      newActiveFilters.push(`budgetSort:${budgetSort}`);
    }

    setActiveFilters(newActiveFilters);
  };

  const handleClearAllFilters = () => {
    setStatus("all");
    setClientType("all");
    setBudgetMin("0");
    setBudgetMax("100000");
    setBudgetMinError("");
    setBudgetMaxError("");
    setBudgetSort("none");
    setActiveFilters([]);
    onClearFilters();
  };

  const applyFilters = (filters: string[] = activeFilters) => {
    const statusFilter =
      (filters
        .find((f) => f.startsWith("status:"))
        ?.split(":")[1] as StatusType) || null;
    const clientTypeFilter =
      (filters
        .find((f) => f.startsWith("clientType:"))
        ?.split(":")[1] as ClientType) || null;
    const budgetSortFilter =
      (filters
        .find((f) => f.startsWith("budgetSort:"))
        ?.split(":")[1] as SortType) || "none";

    let budgetRangeFilter: [number, number] | null = null;
    const budgetRangeString = filters
      .find((f) => f.startsWith("budgetRange:"))
      ?.split(":")[1];
    if (budgetRangeString) {
      const [min, max] = budgetRangeString.split("-").map(Number);
      budgetRangeFilter = [min, max];
    }

    onFilter({
      status: statusFilter,
      budgetRange: budgetRangeFilter,
      clientType: clientTypeFilter,
      budgetSort: budgetSortFilter,
    });
  };

  const handleApplyFilters = () => {
    validateBudgetRange(budgetMin, budgetMax);

    if (budgetMinError || budgetMaxError) {
      return;
    }

    updateActiveFilters();
    handleCloseModal();

    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const FilterButton = () => (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleOpenModal}
      startIcon={<IconFilter size={20} />}
      sx={{ height: "100%" }}
    >
      Filtrar
    </Button>
  );

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <FilterButton />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="filter-modal-title"
      >
        <Box sx={modalStyle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography id="filter-modal-title" variant="h6" component="h2">
              Filtros de Leads
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <IconX size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" gutterBottom>
            Status do Lead
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
            <Select
              id="status-filter"
              value={status}
              onChange={handleStatusChange}
              size="small"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="novo">Novo</MenuItem>
              <MenuItem value="em andamento">Em andamento</MenuItem>
              <MenuItem value="aprovado">Aprovado</MenuItem>
              <MenuItem value="convertido">Convertido</MenuItem>
              <MenuItem value="perdido">Perdido</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom>
            Tipo de Cliente
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
            <Select
              id="client-type-filter"
              value={clientType}
              onChange={handleClientTypeChange}
              size="small"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="b2b">B2B</MenuItem>
              <MenuItem value="b2c">B2C</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom>
            Faixa de Orçamento
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                mb: 2,
                gap: { xs: 2, md: 0 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  gap: 2,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <TextField
                  label="Valor mínimo"
                  value={budgetMin}
                  onChange={handleBudgetMinChange}
                  size="small"
                  fullWidth
                  error={!!budgetMinError}
                  helperText={budgetMinError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconCurrencyReal size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="body1" sx={{ lineHeight: "40px", mx: 1 }}>
                  até
                </Typography>
                <TextField
                  label="Valor máximo"
                  value={budgetMax}
                  onChange={handleBudgetMaxChange}
                  size="small"
                  fullWidth
                  error={!!budgetMaxError}
                  helperText={budgetMaxError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconCurrencyReal size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", md: "auto" },
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1, whiteSpace: "nowrap" }}
                >
                  Ordenar:
                </Typography>
                <ToggleButtonGroup
                  value={budgetSort}
                  exclusive
                  onChange={handleBudgetSortChange}
                  aria-label="ordenar por valor"
                  size="small"
                >
                  <ToggleButton
                    value="asc"
                    aria-label="crescente"
                    title="Menor valor primeiro"
                  >
                    <IconSortAscendingNumbers size={18} />
                  </ToggleButton>
                  <ToggleButton
                    value="desc"
                    aria-label="decrescente"
                    title="Maior valor primeiro"
                  >
                    <IconSortDescendingNumbers size={18} />
                  </ToggleButton>
                  <ToggleButton
                    value="none"
                    aria-label="sem ordenação"
                    title="Sem ordenação"
                  >
                    <IconSortAZ size={18} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAllFilters}
                disabled={activeFilters.length === 0}
              >
                Limpar Filtros
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LeadFilter;
