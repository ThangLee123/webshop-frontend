import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import store from "~/redux/store";

const PrivateRoute = ({ children }) => {
    return localStorage.getItem("userInfo") ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;

