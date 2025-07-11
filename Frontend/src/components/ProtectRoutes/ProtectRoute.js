import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// allowedRoles is optional, e.g. ["admin"]
export const ProtectRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem("authtoken");
    const userRole = localStorage.getItem("userRole");
    const location = useLocation();

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If roles are provided, check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
