import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Avatar,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import useLocalStorage from "../../hook/useLocalStorage.jsx";
import {useSendLogoutMutation} from "../../redux/feature/auth/authApiSlice.js";
import {useNavigate} from "react-router-dom";

function AvatarProfile() {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const [sendLogout, { isLoading, isSuccess, isError, error }] =
        useSendLogoutMutation();

    const [authData, setAuthData] = useLocalStorage('authData', {
        isRemember: false,
        userRoles: "",
        username: null,
    });

    const handleSendLogout = async () => {
        try {
            setAuthData({
                isRemember: false,
                userRoles: "",
                uuid: null,
                siteUuid: null
            });
            await sendLogout().unwrap();
            navigate("/login");
            localStorage.removeItem("isRemember");
            handleClose();
        } catch (err) {
            console.error("Logout failed:", err);
            handleClose();
        }
    };

    const user = {
        name: 'John Doe',
        role: 'Administrator',
        avatar: 'https://i.pravatar.cc/150?img=12'
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        console.log('Go to profile');
        handleClose();
    };

    return (
        <Box>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: 2,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    }
                }}
            >
                <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="body2" fontWeight={600}>
                        {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user.role}
                    </Typography>
                </Box>
                <KeyboardArrowDownIcon
                    sx={{
                        transition: 'transform 0.3s',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        minWidth: 220,
                        mt: 1
                    }
                }}
            >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                        {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user.role}
                    </Typography>
                </Box>

                <Divider />

                {/* Profile */}
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonTwoToneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('profile.title')}</ListItemText>
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem onClick={handleSendLogout}>
                    <ListItemIcon>
                        <LogoutTwoToneIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography color="error">{t('profile.logout')}</Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default AvatarProfile;