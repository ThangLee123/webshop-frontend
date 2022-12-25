import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import store from '~/redux/store';

const AdminRoute = ({ children }) => {
        return (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem("userInfo")).isAdmin === true) ? children : <Navigate to="/signin" />;
};

export default AdminRoute;
