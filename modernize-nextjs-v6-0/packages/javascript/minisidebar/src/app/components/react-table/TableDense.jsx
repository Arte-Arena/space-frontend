'use client';
import * as React from 'react';
import {
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    Typography,
    TableHead,
    Chip,
    Box,
    Grid,
    Button,
    Divider
} from '@mui/material';
import { Stack } from '@mui/system';

import DownloadCard from '@/app/components/shared/DownloadCard';
import { IconCircle, IconClock } from '@tabler/icons-react';
import {
    useReactTable,
    makeStateUpdater,
    getCoreRowModel,
    flexRender,
    functionalUpdate,
    createColumnHelper,
} from '@tanstack/react-table'

const rows = [
    {
        status: 'active',
        avatar: "/images/profile/user-1.jpg",
        tag: 'rhye',
        cname: 'Olivia Rhye',
        email: 'olivia@ui.com',
        teams: [
            { name: 'Design', bgcolor: 'primary.main' },
            { name: 'Product', bgcolor: 'secondary.main' },
        ],
    },
    {
        status: 'offline',
        avatar: "/images/profile/user-2.jpg",
        tag: 'steele',
        cname: 'Barbara Steele',
        email: 'steele@ui.com',
        teams: [
            { name: 'Product', bgcolor: 'secondary.main' },
            { name: 'Operations', bgcolor: 'error.main' },
        ],
    },
    {
        status: 'active',
        avatar: "/images/profile/user-3.jpg",
        tag: 'gordon',
        cname: 'Leonard Gordon',
        email: 'olivia@ui.com',
        teams: [
            { name: 'Finance', bgcolor: 'primary.main' },
            { name: 'Customer Success', bgcolor: 'success.main' },
        ],
    },
    {
        status: 'offline',
        avatar: "/images/profile/user-4.jpg",
        tag: 'pope',
        cname: 'Evelyn Pope',
        email: 'steele@ui.com',
        teams: [
            { name: 'Operations', bgcolor: 'error.main' },
            { name: 'Design', bgcolor: 'primary.main' },
        ],
    },
    {
        status: 'active',
        avatar: "/images/profile/user-5.jpg",
        tag: 'garza',
        cname: 'Tommy Garza',
        email: 'olivia@ui.com',
        teams: [{ name: 'Product', bgcolor: 'secondary.main' }],
    },
    {
        status: 'active',
        avatar: "/images/profile/user-6.jpg",
        tag: 'vasquez',
        cname: 'Isabel Vasquez',
        email: 'steele@ui.com',
        teams: [{ name: 'Customer Success', bgcolor: 'success.main' }],
    },
];


const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('avatar', {
        header: () => 'Customer',
        cell: info => (
            <Stack direction="row" spacing={2}>
                <Avatar src={info.getValue()} alt={info.getValue()} sx={{ width: 42, height: 42 }} />
                <Box>
                    <Typography variant="h6">{info.row.original.cname}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        @{info.row.original.tag}
                    </Typography>
                </Box>
            </Stack>
        ),
    }),
    columnHelper.accessor('status', {
        header: () => 'Status',
        cell: info => (
            <Chip
                label={info.getValue()}
                size="small"
                icon={
                    info.getValue() == 'active' ? <IconCircle width={14} /> : <IconClock width={14} />
                }
                sx={{
                    backgroundColor:
                        info.getValue() == 'active'
                            ? (theme) => theme.palette.success.light
                            : (theme) => theme.palette.grey[100],
                    color:
                        info.getValue() == 'active'
                            ? (theme) => theme.palette.success.main
                            : (theme) => theme.palette.grey[500],
                    '.MuiChip-icon': {
                        color: 'inherit !important',
                    },
                }}
            />
        ),
    }),
    columnHelper.accessor('email', {
        header: () => 'Email Address',
        cell: info => (
            <Typography variant="subtitle1" color="textSecondary">
                {info.getValue()}
            </Typography>
        ),
    }),
    columnHelper.accessor('teams', {
        header: () => 'Teams',
        cell: info => (
            <Box>
                {info.getValue().map((team, index) => (
                    <Chip
                        label={team.name}
                        sx={{ backgroundColor: team.bgcolor, color: 'white', fontSize: '11px', mr: 1 }}
                        key={index}
                        size="small"
                    />
                ))}
            </Box>
        ),
    }),

];

export const DensityFeature = {
    // Define the new feature's initial state
    getInitialState: (state) => {
        return {
            density: 'md',
            ...state,
        };
    },

    // Define the new feature's default options
    getDefaultOptions: (table) => {
        return {
            enableDensity: true,
            onDensityChange: makeStateUpdater('density', table),
        };
    },

    // Define the new feature's table instance methods
    createTable: (table) => {
        table.setDensity = (updater) => {
            const safeUpdater = (old) => {
                let newState = functionalUpdate(updater, old);
                return newState;
            };
            return table.options.onDensityChange?.(safeUpdater);
        };

        table.toggleDensity = (value) => {
            table.setDensity((old) => {
                if (value) return value;
                return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'; // Cycle through the 3 options
            });
        };
    },

};

const TableDense = () => {
    const [data, _setData] = React.useState(() => [...rows]);


    const [density, setDensity] = React.useState('md')

    const table = useReactTable({
        _features: [DensityFeature],
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            density, //passing the density state to the table, TS is still happy :)
        },
        onDensityChange: setDensity,
    });




    const handleDownload = () => {
        const headers = ["Customer", "Status", "Email Address", "Teams"];
        const rows = data.map(item => [

            item.cname,
            item.status,
            item.email,
            item.teams.map(team => team.name).join(", "),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "table-data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (

        <DownloadCard title="Dense Table" onDownload={handleDownload}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box>
                        <Box p={3}>
                            <Button
                                onClick={() => table.toggleDensity()}
                                variant="contained"
                            >
                                Toggle Density
                            </Button>
                        </Box>
                        <Divider />
                        <TableContainer>
                            <Table
                                sx={{
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <TableHead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableCell key={header.id} sx={{
                                                    padding:
                                                        density === 'sm'
                                                            ? '4px'
                                                            : density === 'md'
                                                                ? '8px'
                                                                : '16px',
                                                    transition: 'padding 0.2s',
                                                }}>
                                                    <Typography variant="h6">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} sx={{
                                                    padding:
                                                        density === 'sm'
                                                            ? '4px'
                                                            : density === 'md'
                                                                ? '8px'
                                                                : '16px',
                                                    transition: 'padding 0.2s',
                                                }}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </DownloadCard>

    );
};

export default TableDense;
