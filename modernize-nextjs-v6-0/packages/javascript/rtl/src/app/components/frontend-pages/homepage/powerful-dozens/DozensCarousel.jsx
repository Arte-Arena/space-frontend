'use client';
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Link from "next/link";
import './carousel.css'
import { Box } from "@mui/material";

const DozensCarousel = () => {

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 4500,
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <Slider {...settings} className="dozenscarousel" style={{ marginLeft: '15px' }}>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="https://modernize-nextjs.adminmart.com/">
                            <img src='/images/landingpage/demos/demo-main.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box>
                </div>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="https://modernize-nextjs-dark.vercel.app/dashboards/ecommerce">
                            <img src='/images/landingpage/demos/demo-dark.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box >
                </div>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="#">
                            <img src='/images/landingpage/demos/demo-rtl.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box>
                </div>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="https://modernize-nextjs-horizontal.vercel.app/dashboards/modern">
                            <img src='/images/landingpage/demos/demo-horizontal.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box>
                </div>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="https://modernize-nextjs.adminmart.com/apps/chats">
                            <img src='/images/landingpage/apps/app-chat.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box>
                </div>
                <div>
                    <Box width={380} height={300} borderRadius="16px" sx={{ boxShadow: (theme) => theme.shadows[10]}}>
                        <Link href="https://modernize-nextjs.adminmart.com/apps/email">
                            <img src='/images/landingpage/apps/app-email.jpg' alt="user-img" width={380} height={300} style={{ borderRadius: '16px' }} />
                        </Link>
                    </Box>
                </div>
            </Slider>
        </>
    );
};

export default DozensCarousel;
