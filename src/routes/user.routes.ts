    import express from "express";
    import validateResource from "../middleware/validateResource";
    import { createUserSchema, forgetPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";
    import { createUserHandler, forgetPasswordHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";

    const router = express.Router();

    router.post("/api/users/register", validateResource(createUserSchema), createUserHandler);
    router.patch("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
    router.post("/api/users/forgetpassword", validateResource(forgetPasswordSchema), forgetPasswordHandler);
    router.patch("/api/users/resetpassword/:id/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordHandler);


    export default router;