import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import type { Metadata } from "next";
import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Roboto } from 'next/font/google'
import NavBar from "@/components/Navbar";
import { Box } from '@mui/material';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Arte Arena - Space",
  description: "Espaço de Trabalho Colaborativo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ p: 2 }}>
              <header>
                <NavBar />
              </header>
              <main>
                {children}
              </main>
              <footer>
              </footer>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html >
  );
}
