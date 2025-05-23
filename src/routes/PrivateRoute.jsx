import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    //if (allowedRoles && !allowedRoles.includes(user.rol.toLowerCase())) {
    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(user.rol.toLowerCase())) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
};

export default PrivateRoute;
