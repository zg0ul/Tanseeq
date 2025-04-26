import { Router } from "express";
import { createProject, getProjects } from "../controllers/ProjectController";
import { search } from "../controllers/SearchController";

const router = Router();

router.get("/", search);

export default router;
