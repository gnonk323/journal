import { Router } from "express";
import { getEntriesByMonth, getEntriesByDay, createEntry, deleteEntry } from "../controllers/entry.controller";

const router = Router();

router.get("/", getEntriesByMonth);
router.get("/day", getEntriesByDay);
router.post("/", createEntry);
router.delete("/:id", deleteEntry);

export default router;
