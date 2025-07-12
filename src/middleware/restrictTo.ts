import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/user.model";

export function restrictTo(roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).send("Forbidden: Insufficient permissions");
        }
        next();
    };
}
