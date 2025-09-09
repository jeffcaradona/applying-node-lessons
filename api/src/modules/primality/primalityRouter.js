import { Router } from "express";
import { primeController } from "./primalityControllers.js";

export const primeRouter = Router();

// GET /api/prime?value=...
primeRouter.get("/", primeController.checkPrime);
