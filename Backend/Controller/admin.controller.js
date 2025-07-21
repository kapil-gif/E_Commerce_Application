import { fetchPendingUsers, activateUserById, InactivateUserById, getRoleNameById, fetchAllusers } from "../models/admin.model.js";

// Controller: Get pending users
export const getPendingUsers = async (req, res) => {
    try {
        const users = await fetchPendingUsers();
        res.status(200).json({
            success: true,
            message: "Pending users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Error fetching pending users:", error);
        res.status(500).json({
            success: false,
            message: "Server Error while fetching users"
        });
    }
};

// Controller: Activate user by ID
export const activateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await activateUserById(userId);
        res.status(200).json({
            success: true,
            message: "User activated successfully",
            result
        });
    } catch (error) {
        console.error("Error activating user:", error);
        res.status(500).json({
            success: false,
            message: "Server Error while activating user"
        });
    }
};

export const Inactiveuser = async (req, res) => {
    const Id = req.body.id
    //console.log("user id controller :", Id);

    try {
        const result = await InactivateUserById(Id);
        res.status(200).json({
            success: true,
            message: "User Inactivated successfully",
            data: result
        });
    } catch (error) {
        console.error("Error INactivating user:", error);
        res.status(500).json({
            success: false,
            message: "Server Error while activating user"
        });
    }
};

export const getRoleById = async (req, res) => {
    const roleId = req.query.roleId;
    //console.log("res body rolde id :", roleId);

    try {
        const role = await getRoleNameById(roleId);

        if (!role) {
            return res.status(404).json({ success: false, message: "Role not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            role: role.name
        });
    } catch (error) {
        console.error("Error fetching role:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching role"
        });
    }
};

export const fetchallusers = async (req, res) => {
    try {
        const responceallusers = await fetchAllusers();
        // console.log("fetch all users :", responceallusers);

        if (responceallusers && responceallusers.length > 0) {
            return res.status(200).json({
                code: "200",
                success: true,
                message: "Fetched all users with role user",
                data: responceallusers
            });
        }

        return res.status(404).json({
            code: "404",
            success: false,
            message: "No users found with role user"
        });

    } catch (error) {
        console.error("Fetch All Users Error:", error);
        return res.status(500).json({
            code: "500",
            success: false,
            message: "Server Error: Could not fetch users"
        });
    }
};
