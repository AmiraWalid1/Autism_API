    import express from "express";
    import validateResource from "../middleware/validateResource";
    import { createUserSchema, forgetPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";
    import { createUserHandler, forgetPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";

    const router = express.Router();

    router.post("/api/users/register", validateResource(createUserSchema), createUserHandler);
    router.patch("/api/users/verify/:email/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
    router.post("/api/users/forgetpassword", validateResource(forgetPasswordSchema), forgetPasswordHandler);
    router.patch("/api/users/resetpassword/:email/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordHandler);
    router.get("/api/users/me", getCurrentUserHandler);

    export default router;