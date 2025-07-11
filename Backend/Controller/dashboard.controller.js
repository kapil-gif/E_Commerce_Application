// controller/dashboard.controller.js

export const adminDashboardHandler = async (req, res) => {
    try {
        // Example response — you can replace it with actual DB stats or admin-related data
        res.status(200).json({
            success: true,
            message: "Welcome to the Admin Dashboard",
            user: req.user,  // from verifyToken
            data: {
                stats: {
                    totalUsers: 100,
                    pendingApprovals: 5,
                    products: 250,
                },
            },
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard",
        });
    }
};

export const userDashboardHandler = async (req, res) => {
    try {
        // Example response — customize it to return user-specific data
        res.status(200).json({
            success: true,
            message: "Welcome to the User Dashboard",
            user: req.user, // from verifyToken
            data: {
                recentlyViewed: [],
                recommendedProducts: [],
            },
        });
    } catch (error) {
        console.error("User Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load user dashboard",
        });
    }
};
