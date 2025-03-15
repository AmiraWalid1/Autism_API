    import express from "express";
    import validateResource from "../middleware/validateResource";
    import { createUserSchema, forgetPasswordSchema, verifyUserSchema } from "../schema/user.schema";
    import { createUserHandler, forgetPasswordHandler, verifyUserHandler } from "../controller/user.controller";

    const router = express.Router();

    router.post("/api/users", validateResource(createUserSchema), createUserHandler);
    router.patch("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
    router.post("/api/users/forgetpassword", validateResource(forgetPasswordSchema), forgetPasswordHandler);

    export default router;