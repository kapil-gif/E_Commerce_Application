export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        // console.log("Checking role:", userRole);

        if (!userRole) {
            return res.status(403).json({ message: "Role missing in token" });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access Denied: You don't have permission" });
        }

        next();
    };
};
