'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DemoTitle from './DemoTitle';
import Image from 'next/image';

import Demo1 from '/public/images/landingpage/demos/demo-main.jpg';
import Demo2 from '/public/images/landingpage/demos/demo-dark.jpg';
import Demo3 from '/public/images/landingpage/demos/demo-horizontal.jpg';
import Demo4 from '/public/images/landingpage/demos/demo-rtl.jpg';

import App1 from '/public/images/landingpage/apps/app-calendar.jpg';
import App2 from '/public/images/landingpage/apps/app-chat.jpg';
import App3 from '/public/images/landingpage/apps/app-contact.jpg';
import App4 from '/public/images/landingpage/apps/app-email.jpg';
import App5 from '/public/images/landingpage/apps/app-note.jpg';
import App6 from '/public/images/landingpage/apps/app-user-profile.jpg';
import App7 from '/public/images/landingpage/apps/app-blog.jpg';
import App8 from '/public/images/landingpage/apps/app-ticket.jpg';
import App9 from '/public/images/landingpage/apps/app-ecommerce-shop.jpg';
import App10 from '/public/images/landingpage/apps/app-ecommerce-checkout.jpg';
import App11 from '/public/images/landingpage/apps/app-ecommerce-list.jpg';
import App12 from '/public/images/landingpage/apps/app-kanban.jpg';
import App13 from '/public/images/landingpage/apps/app-invoice.jpg';


import Page1 from '/public/images/landingpage/f-pages/page-homepage.jpg';
import Page2 from '/public/images/landingpage/f-pages/page-about.jpg';
import Page3 from '/public/images/landingpage/f-pages/page-portfolio.jpg';
import Page4 from '/public/images/landingpage/f-pages/page-pricing.jpg';

const demos = [
  {
    link: 'https://modernize-nextjs.adminmart.com/dashboards/modern',
    img: Demo1,
    title: 'Main',
  },
  {
    link: 'https://modernize-nextjs-dark.vercel.app/dashboards/ecommerce',
    img: Demo2,
    title: 'Dark',
  },
  {
    link: 'https://modernize-nextjs-horizontal.vercel.app/dashboards/modern',
    img: Demo3,
    title: 'Horizontal',
  },
  {
    link: '/',
    img: Demo4,
    title: 'RTL-[included with package]',
  },
];

const pages = [
  {
    link: 'https://modernize-nextjs.adminmart.com/frontend-pages/homepage',
    img: Page1,
    title: 'Homepage',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/frontend-pages/about',
    img: Page2,
    title: 'About us',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/frontend-pages/portfolio',
    img: Page3,
    title: 'Portfolio',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/frontend-pages/pricing',
    img: Page4,
    title: 'Pricing',
  },
];

const apps = [
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/kanban',
    img: App12,
    hot: true,
    title: 'Kanban App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/invoice/list',
    img: App13,
    hot: true,
    title: 'Invoice App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/calendar',
    img: App1,
    title: 'Calendar App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/chats',
    img: App2,
    title: 'Chat App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/contacts',
    img: App3,
    title: 'Contact App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/email',
    img: App4,
    title: 'Email App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/notes',
    img: App5,
    title: 'Note App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/user-profile/profile',
    img: App6,
    title: 'User Profile App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/blog/post',
    img: App7,
    title: 'Blog App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/tickets',
    img: App8,
    title: 'Ticket App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/ecommerce/shop',
    img: App9,
    title: 'eCommerce Shop App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/ecommerce/checkout',
    img: App10,
    title: 'eCommerce Checkout App',
  },
  {
    link: 'https://modernize-nextjs.adminmart.com/apps/ecommerce/list',
    img: App11,
    title: 'eCommerce List App',
  },

];

const StyledBox = styled(Box)(() => ({
  overflow: 'auto',
  position: 'relative',
  border: 1,
  borderStyle: 'solid',
  borderColor: '#efefef',
  '.MuiButton-root': {
    display: 'none',
  },
  '&:hover': {
    '.MuiButton-root': {
      display: 'block',
      transform: 'translate(-50%,-50%)',
      position: 'absolute',
      left: '50%',
      right: '50%',
      top: '50%',
      minWidth: '100px',
      zIndex: '9',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: ' 0',
      width: '100%',
      height: '100%',
      zIndex: '8',
      backgroundColor: 'rgba(55,114,255,.2)',
    },
  },
}));

const DemoSlider = () => {
  return (
    <Box
      id="demos"
      pb="140px"
      overflow="hidden"
      sx={{
        pt: {
          sm: '60px',
          lg: '0',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <DemoTitle />

        {/* demos */}
        <Box mt={9}>
          <Grid container mt={2} spacing={3}>
            {demos.map((demo, index) => (
              <Grid item xs={12} lg={3} key={index}>
                <Box>
                  <StyledBox>
                    <Image
                      src={demo.img}
                      alt="demo" width={500} height={500}
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href={demo.link}
                      target="_blank"
                    >
                      Live Preview
                    </Button>
                  </StyledBox>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    textAlign="center"
                    fontWeight={500}
                    mt={2}
                  >
                    {demo.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mb={2} mt={5} textAlign="center">
          <Chip label="Frontend Pages" color="primary" />
        </Box>
        {/* apps */}
        <Box>
          <Grid container mt={2} spacing={3}>
            {pages.map((page, index) => (
              <Grid item xs={12} lg={3} key={index}>
                <Box>
                  <StyledBox>
                    <Image
                      src={page.img} width={500} height={500}
                      alt="app"
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href={page.link}
                      target="_blank"
                    >
                      Live Preview
                    </Button>
                  </StyledBox>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    textAlign="center"
                    fontWeight={500}
                    mt={2}
                  >
                    {page.title} {page.hot ? <Chip label="New" color="error" size="small" /> : null}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mb={2} mt={5} textAlign="center">
          <Chip label="Apps" color="primary" />
        </Box>
        {/* apps */}
        <Box>
          <Grid container mt={2} spacing={3}>
            {apps.map((app, index) => (
              <Grid item xs={12} lg={3} key={index}>
                <Box>
                  <StyledBox>
                    <Image
                      src={app.img} width={500} height={500}
                      alt="app"
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href={app.link}
                      target="_blank"
                    >
                      Live Preview
                    </Button>
                  </StyledBox>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    textAlign="center"
                    fontWeight={500}
                    mt={2}
                  >
                    {app.title} {app.hot ? <Chip label="New" color="error" size="small" /> : null}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DemoSlider;
