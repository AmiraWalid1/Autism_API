    import express from "express";
    import validateResource from "../middleware/validateResource";
    import { createUserSchema, forgetPasswordSchema, resetPasswordSchema, verifyUserSchema, updateUserSchema } from "../schema/user.schema";
    import { createUserHandler, forgetPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler, updateUserHandler ,deleteUserHandler , getAllUsersByIdHandler , getAllUsersHandler , getUsersByRoleHandler} from "../controller/user.controller";

    const router = express.Router();

    router.post("/api/users/register", validateResource(createUserSchema), createUserHandler);
    router.patch("/api/users/verify/:email/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
    router.post("/api/users/forgetpassword", validateResource(forgetPasswordSchema), forgetPasswordHandler);
    router.patch("/api/users/resetpassword/:email/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordHandler);
    router.get("/api/users/me", getCurrentUserHandler);
    router.patch("/api/users/update",validateResource(updateUserSchema),updateUserHandler);
    router.delete("/api/users/delete",deleteUserHandler);
    router.post("/api/users/getAllById", getAllUsersByIdHandler);
    router.get("/api/users", getAllUsersHandler);
    router.get("/api/users/by-role", getUsersByRoleHandler);

    export default router;