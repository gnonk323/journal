import { Router } from "express";
import { checkAuth, login, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router()

router.post("/login", login)
router.post("/logout", logout)
router.get("/check", authenticate, checkAuth)

export default router
