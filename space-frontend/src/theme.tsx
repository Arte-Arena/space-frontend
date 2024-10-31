'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#616161',
            contrastText: '#fafafa',
        },
        error: {
            main: '#ff3333',
        },
        warning: {
            main: '#ffff00',
        },
        success: {
            main: '#00ff00',
        },
        info: {
            main: '#616161',
            contrastText: '#fafafa',
        },
    },
    typography: {
      fontFamily: 'var(--font-roboto)',
    },
});

export default theme;
