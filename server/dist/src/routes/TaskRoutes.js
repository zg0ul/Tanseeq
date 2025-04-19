"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const router = (0, express_1.Router)();
router.get("/", TaskController_1.getTasks);
router.post("/", TaskController_1.createTask);
// the patch method is used to update a resource
// in a partial way, meaning that only the fields that are provided in the request body will be updated
// taskId is the id of the task to be updated and it's dynamic
router.patch("/:taskId/status", TaskController_1.updateTaskStatus);
exports.default = router;
