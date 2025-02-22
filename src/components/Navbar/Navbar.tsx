import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { AppBar, Button, Box } from '@mui/material';
import useDashboardStore from '../../store/dashboardStore';
import { useSocialStore } from '../../store/socialStore';
import { BiLogOut } from "react-icons/bi";
import { StyledToolbar } from './Navbar.styled';

const Navbar: React.FC = () => {
    const signOut = useAuthStore((state) => state.signOut);
    const clearCities = useDashboardStore((state) => state.clear);
    const clearPosts = useSocialStore((state) => state.clear);
    const navigate = useNavigate();

    const handleSignOut = () => {
        clearCities();
        clearPosts()
        signOut();
        navigate('/signIn');
    };

    return (
        <AppBar position="fixed">
            <StyledToolbar>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/social')}>
                        Social
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/settings')}>
                        Settings
                    </Button>
                </Box>
                <Box sx={{  cursor: 'pointer' }}>
                    <div onClick={handleSignOut} style={{ display: 'flex', gap: 15, alignItems: 'baseline' }}>
                        Sign out
                        <BiLogOut />
                    </div>
                </Box>
            </StyledToolbar>
        </AppBar>
    );
};

export default Navbar;