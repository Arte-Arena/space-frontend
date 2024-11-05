'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {

      const dataBody = JSON.stringify({
        email,
        password,
      });

      console.log(dataBody);

      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataBody
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
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              required
              fullWidth
              id="password"
              label="Senha"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Grid2>
        </form>
      </Box>
    </Container>
  );
};

export default LoginScreen;

