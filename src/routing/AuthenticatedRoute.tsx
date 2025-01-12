import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar/Navbar';


const AuthenticatedRoute = () => {
    const accessToken = useAuthStore((state) => state.token);

    return accessToken ? <><Navbar/><Outlet /></> : <Navigate to="/login" />;
};

export default AuthenticatedRoute;