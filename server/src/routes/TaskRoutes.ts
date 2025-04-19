import { Router } from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/TaskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
// the patch method is used to update a resource
// in a partial way, meaning that only the fields that are provided in the request body will be updated
// taskId is the id of the task to be updated and it's dynamic
router.patch("/:taskId/status", updateTaskStatus); 

export default router;
