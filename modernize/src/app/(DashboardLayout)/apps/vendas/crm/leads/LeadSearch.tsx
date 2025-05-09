"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  InputAdornment,
  SelectChangeEvent,
  Paper,
  Chip,
  Typography,
} from "@mui/material";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import LeadFilter from "./LeadFilter";

type SearchType = "nome" | "celular" | "cpf" | "cnpj" | "idOcta";
type StatusType =
  | "all"
  | "novo"
  | "em andamento"
  | "aprovado"
  | "convertido"
  | "perdido";
type ClientType = "all" | "b2b" | "b2c";

interface LeadSearchProps {
  onSearch: (searchTerm: string, searchType: SearchType) => void;
  onFilter: (filters: {
    status: StatusType | null;
    budgetRange: [number, number] | null;
    clientType: ClientType | null;
    budgetSort: "none" | "asc" | "desc";
  }) => void;
  onClearFilters: () => void;
}

const LeadSearch: React.FC<LeadSearchProps> = ({
  onSearch,
  onFilter,
  onClearFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("nome");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchTypeChange = (event: SelectChangeEvent) => {
    setSearchType(event.target.value as SearchType);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm, searchType);
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case "nome":
        return "Digite o nome do cliente";
      case "celular":
        return "Digite o número do celular";
      case "cpf":
        return "Digite o CPF";
      case "cnpj":
        return "Digite o CNPJ";
      case "idOcta":
        return "Digite o ID do Octa";
      default:
        return "Pesquisar";
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "info";
      case "em andamento":
        return "warning";
      case "aprovado":
        return "success";
      case "convertido":
        return "primary";
      case "perdido":
        return "error";
      default:
        return "default";
    }
  };

  const getFilterLabel = (filter: string) => {
    const [type, value] = filter.split(":");

    if (type === "status") {
      return `Status: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
    } else if (type === "clientType") {
      return `Tipo: ${value === "b2b" ? "B2B" : "B2C"}`;
    } else if (type === "budgetRange") {
      const [min, max] = value.split("-");
      return `Orçamento: ${formatCurrency(Number(min))} - ${formatCurrency(Number(max))}`;
    } else if (type === "budgetSort") {
      return `Ordenação: ${value === "asc" ? "Menor valor" : "Maior valor"}`;
    }

    return filter;
  };

  const handleRemoveFilter = (filter: string) => {
    const newActiveFilters = activeFilters.filter((f) => f !== filter);
    setActiveFilters(newActiveFilters);

    const [filterType, filterValue] = filter.split(":");

    const statusFilter =
      filterType === "status"
        ? null
        : (newActiveFilters
            .find((f) => f.startsWith("status:"))
            ?.split(":")[1] as StatusType) || null;

    const clientTypeFilter =
      filterType === "clientType"
        ? null
        : (newActiveFilters
            .find((f) => f.startsWith("clientType:"))
            ?.split(":")[1] as ClientType) || null;

    const budgetSortFilter =
      filterType === "budgetSort"
        ? "none"
        : (newActiveFilters
            .find((f) => f.startsWith("budgetSort:"))
            ?.split(":")[1] as "none" | "asc" | "desc") || "none";

    let budgetRangeFilter: [number, number] | null = null;
    if (filterType !== "budgetRange") {
      const budgetRangeString = newActiveFilters
        .find((f) => f.startsWith("budgetRange:"))
        ?.split(":")[1];
      if (budgetRangeString) {
        const [min, max] = budgetRangeString.split("-").map(Number);
        budgetRangeFilter = [min, max];
      }
    }

    onFilter({
      status: statusFilter,
      budgetRange: budgetRangeFilter,
      clientType: clientTypeFilter,
      budgetSort: budgetSortFilter,
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    onClearFilters();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="search-type-label">Pesquisar por</InputLabel>
            <Select
              labelId="search-type-label"
              id="search-type"
              value={searchType}
              onChange={handleSearchTypeChange}
              label="Pesquisar por"
            >
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="celular">Celular</MenuItem>
              <MenuItem value="cpf">CPF</MenuItem>
              <MenuItem value="cnpj">CNPJ</MenuItem>
              <MenuItem value="idOcta">ID do Octa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder={getPlaceholder()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
                sx={{ height: "100%" }}
              >
                Pesquisar
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              <LeadFilter
                onFilter={onFilter}
                onClearFilters={onClearFilters}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {activeFilters.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Filtros ativos:
          </Typography>
          {activeFilters.map((filter) => (
            <Chip
              key={filter}
              label={getFilterLabel(filter)}
              onDelete={() => handleRemoveFilter(filter)}
              color={
                filter.startsWith("status:")
                  ? (getStatusColor(filter.split(":")[1]) as any)
                  : "default"
              }
              size="small"
            />
          ))}
          {activeFilters.length > 1 && (
            <Chip
              label="Limpar todos"
              onDelete={handleClearAllFilters}
              color="error"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default LeadSearch;
