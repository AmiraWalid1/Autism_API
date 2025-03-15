import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import log from "../utils/logger";

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try{
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch(err: any){
        log.error(err, "Validation error");
        res.status(400).json({
            message: "Validation error",
            errors: err.errors.map((e: { path: string[]; message: string}) => ({
                path: e.path.join("."),
                message: e.message
            }))
        })
    }
}

export default validateResource;