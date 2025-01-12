import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import useDashboardStore from '../../store/dashboardStore';

const Navbar: React.FC = () => {
    const signOut = useAuthStore((state) => state.signOut);
    const clearCities = useDashboardStore((state) => state.clear);
    const navigate = useNavigate();

    const handleSignOut = () => {
        clearCities();
        signOut();
        navigate('/signIn');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Can I Run Today?
                </Typography> */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/settings')}>
                        Settings
                    </Button>
                    <Button color="inherit" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;