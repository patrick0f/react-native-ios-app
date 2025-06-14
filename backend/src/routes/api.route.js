import express from "express";
import { entryCategory } from "../controllers/api.controller.js";

const router = express.Router();

router.post("/category", entryCategory);

export default router; 