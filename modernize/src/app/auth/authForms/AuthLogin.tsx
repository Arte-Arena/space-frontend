'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const dataBody = JSON.stringify({
        email,
        password,
      });
      const response = await fetch('http://abf47d2d8539140fbb162c08e4d144a2-1032230775.sa-east-1.elb.amazonaws.com/api/login', {
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
      }
      router.push('/');
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      alert('Falha no login. Verifique seu email e senha.');
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