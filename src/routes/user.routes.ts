    import express from "express";
    import validateResource from "../middleware/validateResource";
    import { createUserSchema, verifyUserSchema } from "../schema/user.schema";
    import { createUserHandler, verifyUserHandler } from "../controller/user.controller";

    const router = express.Router();

    router.post("/api/users", validateResource(createUserSchema), createUserHandler);
    router.get("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);

    export default router;