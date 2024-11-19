'use client'
import { useState } from 'react';
import { Box, Typography, Button, Divider } from "@mui/material";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { registerType } from "@/app/(DashboardLayout)/types/auth/auth";

const AuthRegister = ({ title }: registerType) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/super-admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration error: ${response.status}`);
      }

      alert('Registration successful');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (error) {
      console.error('Registration error:', (error as Error).message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}


      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            Novo Usuário
          </Typography>
        </Divider>
      </Box>

      <Box>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
          <CustomTextField
            id="name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            value={email}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <CustomFormLabel htmlFor="password">Confirmar Senha</CustomFormLabel>
          <CustomTextField
            id="passwordConfirmation"
            type="password"
            variant="outlined"
            value={passwordConfirmation}
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
          />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
        >
          Registrar Novo Usuário
        </Button>
      </Box>
    </>
  );
};

export default AuthRegister;
