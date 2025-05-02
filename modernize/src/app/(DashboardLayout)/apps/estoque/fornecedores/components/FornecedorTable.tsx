'use client'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Collapse, Box, Typography, Paper,
  Link
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Fornecedor, Produto } from './Types';
import { useState } from 'react';
import { IconPencil } from '@tabler/icons-react';

interface RowProps { fornecedor: Fornecedor; }

function Row({ fornecedor }: RowProps) {

  return (
    <>
      {/* Linha principal */}
      <TableRow>
        <TableCell align="center">{fornecedor.id}</TableCell>
        <TableCell align="center">
          <Link
            component={Link}
            href={`/apps/estoque/fornecedores/${fornecedor.id}`}
            underline="hover"
            target="_blank"
            sx={{ fontWeight: '500' }}
          >
            <Typography variant="body2" component="span" color="text.primary">
              {fornecedor.nome_completo}
            </Typography>
          </Link>
        </TableCell>

        {/* Nova coluna “Produtos” */}
        <TableCell align="center">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {fornecedor.produtos.map((p: Produto) => (
              <Box
                key={p.id}
                sx={{
                  px: 1.2, py: 0.5, borderRadius: '12px',
                  backgroundColor: '#1976d2',  // ou use um objeto de cores
                  color: 'white', fontSize: '0.75rem',
                  fontWeight: 500, lineHeight: 1, textAlign: 'center'
                }}
              >
                {p.nome ?? '-'}
              </Box>
            ))}
          </Box>
        </TableCell>

        <TableCell align="center">{fornecedor.email}</TableCell>
        <TableCell align="center">{fornecedor.celular}</TableCell>
        <TableCell align="center">{new Date(fornecedor.created_at).toLocaleDateString()}</TableCell>
        <TableCell align="center">{new Date(fornecedor.updated_at).toLocaleDateString()}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="edit" onClick={() => { window.location.href = `/apps/estoque/fornecedores/editar/${fornecedor.id}`; }}>
            <IconPencil />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function FornecedoresTable({ data }: { data: Fornecedor[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Nome</TableCell>
            <TableCell align="center">Produtos</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Celular</TableCell>
            <TableCell align="center">Criado em</TableCell>
            <TableCell align="center">Última atualização</TableCell>
            <TableCell align="center">Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(f => <Row key={f.id} fornecedor={f} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
