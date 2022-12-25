import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import store from '~/redux/store';

const SellerRoute = ({ children }) => {
    return localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).isSeller === true ? (
        children
    ) : (
        <Navigate to="/signin" />
    );
};

export default SellerRoute;
