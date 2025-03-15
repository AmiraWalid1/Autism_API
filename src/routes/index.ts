import express from "express";
import user from "./user.routes"
import auth from "./auth.routes"

const router = express.Router();

router.use(auth);
router.use(user);

export default router;