import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    //console.log("authheader :", authorization);


    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       // console.log("Decoded token:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Token invalid or expired" });
    }
};
