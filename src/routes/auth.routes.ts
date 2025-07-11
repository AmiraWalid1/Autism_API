import express from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";
import { createSessionHandler } from "../controller/auth.controller";

const router = express.Router();

router.post(
    "/api/auth/login",
    validateResource(createSessionSchema),
    createSessionHandler
  );

export default router;
