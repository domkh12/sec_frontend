import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const languages = [
    {
        code: 'en',
        name: 'English',
        flag: 'https://flagcdn.com/w40/us.png'
    },
    {
        code: 'km',
        name: 'ភាសាខ្មែរ',
        flag: 'https://flagcdn.com/w40/kh.png'
    },
    {
        code: 'zh',
        name: '中文',
        flag: 'https://flagcdn.com/w40/cn.png'
    },
    {
        code: 'ko',
        name: '한국어',
        flag: 'https://flagcdn.com/w40/kr.png'
    },
    {
        code: 'tl',
        name: 'Filipino',
        flag: 'https://flagcdn.com/w40/ph.png'
    }
];

function TranslateButton() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        handleClose();
    };

    return (
        <Box>
            <Button
                disableRipple
                disableElevation
                variant="contained"
                onClick={handleClick}
                startIcon={
                    <img
                    src={currentLanguage.flag}
                    alt={currentLanguage.flag}
                    style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '2px' }}
                    />
                }
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    borderRadius: 1,
                    px: 2,
                }}
            >
                {currentLanguage.name}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: { minWidth: 180 }
                }}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        selected={language.code === i18n.language}
                    >
                        <ListItemIcon>
                            <img
                                src={language.flag}
                                alt={language.name}
                                style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                        </ListItemIcon>
                        <ListItemText>{language.name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default TranslateButton;