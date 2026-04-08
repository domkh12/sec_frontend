import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import CardMODetail from '../card/CardMODetail'

export default function MOCarousel() {
    const autoplay = Autoplay({ delay: 3500, stopOnInteraction: false })
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start' },
        [autoplay]
    )
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCurrent(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        setCount(emblaApi.scrollSnapList().length)
        emblaApi.on('select', onSelect)
        onSelect()
    }, [emblaApi, onSelect])

    return (
        <Box>
            {/* Viewport */}
            <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' }, minWidth: 0 }}>
                        <CardMODetail />
                    </Box>
                    <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' }, minWidth: 0 }}>
                        <CardMODetail />
                    </Box>
                    <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 50%', md: '0 0 33.333%' }, minWidth: 0 }}>
                        <CardMODetail />
                    </Box>
                </Box>
            </Box>

            {/* Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <IconButton sx={{color: "white"}} onClick={() => emblaApi?.scrollPrev()}>
                    <ArrowBackIos fontSize="small" />
                </IconButton>

                {/* Dots */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            sx={{
                                width: i === current ? 20 : 7,
                                color: "white",
                                height: 7,
                                borderRadius: i === current ? '4px' : '50%',
                                bgcolor: i === current ? 'white' : 'gray',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                            }}
                        />
                    ))}
                </Box>

                <IconButton sx={{color: "white"}} onClick={() => emblaApi?.scrollNext()}>
                    <ArrowForwardIos fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}