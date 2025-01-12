import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authenticated-api';
import useAuthStore, { User } from '../../store/authStore';


interface FormFields {
    email: string;
    password: string;
}

const SignIn = () => {
    const accessToken = useAuthStore((state) => state.token);
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const loading = useAuthStore((state) => state.loading); 
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard');
        }
    }, [accessToken, navigate]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setError('');
        const response = await login(data.email, data.password);
        if (response.success) {
            if (response.data) {
                const refreshToken = response.data["refresh_token"] as string;
                const token = response.data["access_token"] as string;
                const user = response.data["user"] as User;
                setAuthData(user, token, refreshToken);
                // navigate('/dashboard');
            } else {
                setError('Invalid response data');
            }
        } else {
            setError(response.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black' }}>
                    Sign In
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/register')}
                        sx={{ mr: 1 }}
                    >
                        Register
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SignIn;

