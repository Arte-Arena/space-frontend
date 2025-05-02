'use client';

import React, { useState, useRef } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import {
  IconFolder,
  IconFile,
  IconUpload,
  IconDownload,
  IconChevronLeft,
  IconChevronRight,
  IconArrowUp,
  IconChevronDown,
} from '@tabler/icons-react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

interface FileNode {
  name: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const exampleTree: FileNode[] = [
  {
    name: 'Documents',
    isDirectory: true,
    children: [
      { name: 'Report.pdf', isDirectory: false },
      {
        name: 'Projects',
        isDirectory: true,
        children: [
          { name: 'Design.sketch', isDirectory: false },
          { name: 'Budget.xlsx', isDirectory: false },
        ],
      },
    ],
  },
  { name: 'Readme.txt', isDirectory: false },
];

const drawerWidth = 240;

export default function FilesystemExplorer() {
  // histórico de navegação
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // estado de expansão do tree
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper para encontrar nós no path atual
  const getNodesAtPath = (path: string): FileNode[] => {
    if (!path) return exampleTree;
    const parts = path.split('/');
    let nodes = exampleTree;
    for (const part of parts) {
      const found = nodes.find(n => n.isDirectory && n.name === part);
      if (!found) return [];
      nodes = found.children ?? [];
    }
    return nodes;
  };

  const currentPath = history[historyIndex];
  const currentNodes = getNodesAtPath(currentPath);

  // navegação back/forward/up
  const canBack = historyIndex > 0;
  const canForward = historyIndex < history.length - 1;
  const canUp = !!currentPath;

  const navigateTo = (path: string) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(path);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleBack = () => canBack && setHistoryIndex(i => i - 1);
  const handleForward = () => canForward && setHistoryIndex(i => i + 1);
  const handleUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    navigateTo(parts.join('/'));
  };

  // download stub
  const downloadFile = (path: string) => {
    window.open(`/api/download?path=${encodeURIComponent(path)}`, '_blank');
  };

  // upload
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('Uploading', file.name, 'to', currentPath);
    e.target.value = '';
  };

  // expand / collapse
  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // renderiza recursivamente a árvore
  const renderTree = (nodes: FileNode[], parentPath = '') =>
    nodes.map(node => {
      const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = !!expandedPaths[fullPath];

      return (
        <Box key={fullPath} sx={{ pl: node.isDirectory ? 2 : 4 }}>
          <Box display="flex" alignItems="center" sx={{ userSelect: 'none' }}>
            {node.isDirectory ? (
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  toggleExpand(fullPath);
                }}
              >
                {isExpanded ? (
                  <IconChevronDown className="w-4 h-4" />
                ) : (
                  <IconChevronRight className="w-4 h-4" />
                )}
              </IconButton>
            ) : (
              <Box sx={{ width: 32 }} />
            )}

            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                if (node.isDirectory) {
                  navigateTo(fullPath);
                } else {
                  downloadFile(fullPath);
                }
              }}
            >
              {node.isDirectory ? (
                <IconFolder className="w-5 h-5 mr-2" />
              ) : (
                <IconFile className="w-4 h-4 mr-2" />
              )}
              <Typography variant="body2">{node.name}</Typography>
            </Box>
          </Box>

          {node.isDirectory && isExpanded && node.children && (
            <Box>{renderTree(node.children, fullPath)}</Box>
          )}
        </Box>
      );
    });

  return (
    <PageContainer>
      <Breadcrumb
        title="Documentos"
        items={[{ label: 'Home', href: '/' }, { label: 'Documentos' }]}
      />

      <Box sx={{ display: 'flex' }}>
        {/* Drawer com TreeView expand/collapse */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            position: 'relative',
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              position: 'relative',
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />

          {/* Upload na sidebar */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1">Navegação</Typography>
            <IconButton size="small" onClick={handleUploadClick}>
              <IconUpload className="w-5 h-5" />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </Box>

          <Box sx={{ overflow: 'auto', p: 1 }}>
            {renderTree(exampleTree)}
          </Box>
        </Drawer>

        {/* Área principal */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Toolbar />

          {/* Painel de navegação */}
          <Box display="flex" alignItems="center" mb={2} gap={1}>
            <IconButton onClick={handleBack} disabled={!canBack}>
              <IconChevronLeft />
            </IconButton>
            <IconButton onClick={handleForward} disabled={!canForward}>
              <IconChevronRight />
            </IconButton>
            <IconButton onClick={handleUp} disabled={!canUp}>
              <IconArrowUp />
            </IconButton>
            <Typography variant="body2" ml={2}>
              {currentPath || 'Raiz'}
            </Typography>
          </Box>

          {/* Ações globais */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="outlined"
              startIcon={<IconUpload />}
              sx={{ mr: 1 }}
              onClick={handleUploadClick}
            >
              Enviar
            </Button>
            <Button
              variant="outlined"
              startIcon={<IconDownload />}
              onClick={() => downloadFile(currentPath)}
            >
              Baixar tudo
            </Button>
          </Box>

          {/* Tabela de arquivos */}
          <Table>
            <TableHead>
              <TableRow>
                {['Nome', 'Tamanho', 'Data', 'Ações'].map(col => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentNodes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Pasta vazia
                  </TableCell>
                </TableRow>
              )}
              {currentNodes.map(node => {
                const path = currentPath ? `${currentPath}/${node.name}` : node.name;
                return (
                  <TableRow
                    key={path}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (node.isDirectory) {
                        navigateTo(path);
                      } else {
                        downloadFile(path);
                      }
                    }}
                  >
                    <TableCell>
                      {node.isDirectory ? (
                        <IconFolder className="w-5 h-5 mr-1 inline" />
                      ) : (
                        <IconFile className="w-4 h-4 mr-1 inline" />
                      )}
                      {node.name}
                    </TableCell>
                    <TableCell>{/* tamanho */}</TableCell>
                    <TableCell>{/* data */}</TableCell>
                    <TableCell>
                      {!node.isDirectory && (
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            downloadFile(path);
                          }}
                        >
                          <IconDownload className="w-5 h-5" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </PageContainer>
  );
}
