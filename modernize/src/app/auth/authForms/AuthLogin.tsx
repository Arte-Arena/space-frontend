'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const dataBody = JSON.stringify({
        email,
        password,
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataBody,
      });
      if (!response.ok) {
        throw new Error(`Login error: ${response.status}`);
      }
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
      } else {
        console.log("Erro: Sem acesso ao token de acesso.");
      }
      
      // Verifica o role do usuário
      if (data.user_roles) {
        localStorage.setItem('roles', data.user_roles);
      } else {
        console.log("Erro: Sem acesso aos papéis.");
      }

      // Grava nome, email e cargos do usuário
      if (data.user_name) {
        localStorage.setItem('name', data.user_name);
      } else {
        console.log("Erro: Sem acesso ao nome.");
      }

      if (data.user_email) {
        localStorage.setItem('email', data.user_email);
      } else {
        console.log("Erro: Sem acesso ao email.");
      
      }
      if (data.user_cargos) {
        localStorage.setItem('cargos', data.user_cargos);
      } else {
        console.log("Erro: Sem acesso aos cargos.");
      }

      router.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error('Login error:', (error as Error).message);
      alert('Falha no login. Verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        {title ? (
          <Typography fontWeight="700" variant="h3" mb={1}>
            {title}
          </Typography>
        ) : null}

        {subtext}

        <Stack>
          <Box>
            <CustomFormLabel htmlFor="username">Email</CustomFormLabel>
            <CustomTextField
              id="username"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >

            <Typography
              component={Link}
              href="/auth/auth1/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Esqueceu sua senha ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Entrar
          </Button>

        </Box>
        {subtitle}
      </form>

    </>
  );
};

export default AuthLogin;