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
} from "@mui/material";
import { IconSearch } from "@tabler/icons-react";

type SearchType = "nome" | "celular" | "cpf" | "cnpj" | "idOcta";

interface LeadSearchProps {
  onSearch: (searchTerm: string, searchType: SearchType) => void;
}

const LeadSearch: React.FC<LeadSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("nome");

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
        <Grid item xs={12} md={7}>
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
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            sx={{ height: "100%" }}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LeadSearch;
