'use client'
import React, { useState } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import { IconCopy } from '@tabler/icons-react';


interface ShortUrlResponse {
  code: string;
}

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Encurtador de Links",
  },
];

const EncurtadorLink = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  const handleFetchShortUrl = async (url: string): Promise<ShortUrlResponse | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/encurtador-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Erro ao encurtar a URL");
      }

      const data: ShortUrlResponse = await response.json();
      const fullUrl = `${window.location.origin}/p/${data.code}`;
      console.log(fullUrl);
      setShortUrl(fullUrl);
      return data;
    } catch (err) {
      console.error(err);
      setError("Não foi possível encurtar a URL. Tente novamente.");
      return null;
    }
  };

  const handleOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (url) {
      const data = await handleFetchShortUrl(url);
    }
  };

  return (
    <PageContainer>
      <Breadcrumb title="Encurtador de Links" items={BCrumb} />
      <Typography variant="h5" gutterBottom>
        Encurtador de Link
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <CustomTextField
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const handleOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                if (url) {
                  const data = await handleFetchShortUrl(url);
                }
              };
            }}
            label="URL"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={!url}
            onClick={handleOnSubmit}
          >
            Encurtador
          </Button>
        </Grid>
      </Grid>
      <div>

        {shortUrl && (
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid grey', borderRadius: 1 }}>
            {shortUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {shortUrl}
                </Typography>
                <IconButton onClick={() => { navigator.clipboard.writeText(shortUrl); }}>
                  <IconCopy />
                  <Typography variant="body2">Copiar Link</Typography>
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </div>
    </PageContainer>

  );
};

export default EncurtadorLink;