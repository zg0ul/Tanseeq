import { Router } from "express";
import { getTeams } from "../controllers/TeamControllers";

const router = Router();

router.get("/", getTeams);

export default router;
