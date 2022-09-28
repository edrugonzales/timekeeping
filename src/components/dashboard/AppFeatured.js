import { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// material
import { alpha, useTheme, styled } from '@material-ui/core/styles';
import { CardContent, Box, Card, Typography } from '@material-ui/core';
// utils
//
import { varFadeInRight, MotionContainer } from 'components/animate';
import { CarouselControlsPaging1, CarouselControlsArrowsBasic1 } from 'components/carousel';

import news_api from 'utils/api/news'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------
const CarouselImgStyle = styled('img')(({ theme }) => ({
    height: 280,
    width: '100%',
    objectFit: 'cover',
    [theme.breakpoints.up('xl')]: {
        height: 320
    }
}));

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
    item: PropTypes.object,
    isActive: PropTypes.bool
};

function CarouselItem({ item, isActive }) {
    const { urlToImage, url, title, description } = item;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" >
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        top: 0,
                        width: 1,
                        height: 1,
                        position: 'absolute',
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.20)
                    }}
                />
                <CarouselImgStyle alt={title} src={urlToImage} />
                <CardContent
                    sx={{
                        bottom: 0,
                        width: 1,
                        textAlign: 'left',
                        position: 'absolute',
                        color: 'common.white'
                    }}
                >
                    <MotionContainer open={isActive}>
                        <motion.div variants={varFadeInRight}>
                            <Typography
                                variant="overline"
                                sx={{
                                    mb: 1,
                                    opacity: 0.48,
                                    display: 'block'
                                }}
                            >
                                Recent News
                            </Typography>
                        </motion.div>
                        <motion.div variants={varFadeInRight}>
                            <Typography variant="h5" gutterBottom noWrap>
                                {title}
                            </Typography>
                        </motion.div>
                        <motion.div variants={varFadeInRight}>
                            <Typography variant="body2" noWrap>
                                {description}
                            </Typography>
                        </motion.div>
                    </MotionContainer>
                </CardContent>
            </Box>
        </a>
    );
}

export default function AppFeatured() {
    const theme = useTheme();
    const carouselRef = useRef();
    const [news, setNews] = useState([])

    useEffect(() => {
        const load = async () => {
            const result = await news_api.get_news();
            if (!result.ok) 
            {
                Bugsnag.notify(result)
                return;
            }
            setNews(result.data.articles)
        }

        load()
    }, [])

    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? news.length - 1 : 0);
    const settings = {
        speed: 800,
        dots: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next),
        ...CarouselControlsPaging1({
            color: 'primary.main',
            sx: {
                top: theme.spacing(3),
                left: theme.spacing(3),
                bottom: 'auto',
                right: 'auto'
            }
        })
    };


    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };

    return (
        <Card>
            <Slider ref={carouselRef} {...settings}>
                {news.map((app, index) => (
                    <CarouselItem key={app.id} item={app} isActive={index === currentIndex} />
                ))}
            </Slider>

            <CarouselControlsArrowsBasic1 onNext={handleNext} onPrevious={handlePrevious} />
        </Card>
    );
}
