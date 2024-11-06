'use client';
import React from 'react';
import { Box, Grid, Typography, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const PaymentMethods = () => {
    return (
        <>


            <Typography textAlign="center" mt={6}
                variant="body1"
            >
                Secured payment with PayPal & Razorpay
            </Typography>

            <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="center" mt={4} gap="56px">
                <Link href="#">
                    <Tooltip title="Visa">
                        <Image src="/images/frontend-pages/payments/icon-visa.svg" width={60} height={20} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="Mastercard">
                        <Image src="/images/frontend-pages/payments/icon-mastercard.svg" width={45} height={25} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="American express">
                        <Image src="/images/frontend-pages/payments/icon-american-express.svg" width={80} height={34} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="Discover">
                        <Image src="/images/frontend-pages/payments/icon-discover.svg" width={95} height={16} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="Paypal">
                        <Image src="/images/frontend-pages/payments/icon-paypal.svg" width={90} height={24} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="Maestro">
                        <Image src="/images/frontend-pages/payments/icon-masetro.svg" width={45} height={28} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#" >
                    <Tooltip title="JCB">
                        <Image src="/images/frontend-pages/payments/icon-jcb.svg" width={31} height={24} alt="payment" />
                    </Tooltip>
                </Link>
                <Link href="#">
                    <Tooltip title="Diners">
                        <Image src="/images/frontend-pages/payments/icon-diners.svg" width={92} height={24} alt="payment" />
                    </Tooltip>
                </Link>
            </Box>
        </>
    );
};

export default PaymentMethods;
