import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.service";
import log from "../utils/logger";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).send("Unauthorized: User not found");
        }

        res.locals.user = user;
        next();
    } catch (err) {
        log.error(err, "Error in authMiddleware");
        return res.status(401).send("Unauthorized: Invalid token");
    }
}