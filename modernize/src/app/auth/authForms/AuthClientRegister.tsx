'use client'

import React from 'react';
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

interface RegisterType {
  title?: string;
  subtitle?: JSX.Element;
  subtext?: JSX.Element;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .min(11, 'CPF deve ter 11 dígitos')
    .max(11, 'CPF deve ter 11 dígitos'),
  phone: yup
    .string()
    .required('Telefone é obrigatório'),
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

const AuthClientRegister = ({ title, subtitle, subtext }: RegisterType) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      cpf: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (_) => {
      setIsLoading(true);
      try {
        router.push('/auth/auth3/login');
      } catch (error) {
        console.error('Erro no registro:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {title && (
          <Typography fontWeight="700" variant="h3" mb={1}>
            {title}
          </Typography>
        )}

        {subtext}

        <Stack spacing={2} mb={3}>
          <Box>
            <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="cpf">CPF</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="cpf"
              name="cpf"
              value={formik.values.cpf}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cpf && Boolean(formik.errors.cpf)}
              helperText={formik.touched.cpf && formik.errors.cpf}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="phone">Telefone</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
            <CustomTextField
              fullWidth
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="confirmPassword">Confirmar Senha</CustomFormLabel>
            <CustomTextField
              fullWidth
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Box>
        </Stack>

        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Criar Conta
          </Button>
        </Box>
        {subtitle}
      </form>
    </>
  );
};

export default AuthClientRegister;