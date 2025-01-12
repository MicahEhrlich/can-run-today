import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const PageNotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Button variant="contained" color="primary" onClick={handleGoBack}>
                Go to Login Page
            </Button>
        </div>
    );
};

export default PageNotFound;