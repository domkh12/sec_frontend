import { useMediaQuery, useTheme } from '@mui/material';

export const useBreakpoints = () => {
    const theme = useTheme();

    return {
        isSm: useMediaQuery(theme.breakpoints.up('sm')),  // >= 640px
        isMd: useMediaQuery(theme.breakpoints.up('md')),  // >= 768px
        isLg: useMediaQuery(theme.breakpoints.up('lg')),  // >= 1024px
        isXl: useMediaQuery(theme.breakpoints.up('xl')),  // >= 1280px
        is2xl: useMediaQuery(theme.breakpoints.up('xxl')), // >= 1536px
    };
};