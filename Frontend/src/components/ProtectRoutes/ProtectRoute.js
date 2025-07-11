// src/components/ProtectRoutes/ProtectRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem("authtoken");
    const userRole = localStorage.getItem("userRole");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    //console.log("alowed roles : ", allowedRoles);

    // console.log("allowedRoles.includes(userRole)", allowedRoles.includes(userRole));

    if (allowedRoles.length > 0 && allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
