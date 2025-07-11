import { fetchPendingUsers, activateUserById, getRoleNameById } from "../models/admin.model.js";

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
