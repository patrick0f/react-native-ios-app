import express from "express";
import { createEntry, getEntries, updateEntry, deleteEntry } from "../controllers/entry.controller.js";

const router = express.Router();

router.post("/", createEntry);
router.get("/", getEntries);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router; 