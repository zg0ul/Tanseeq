"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const router = (0, express_1.Router)();
// In the index we define the project route to be /projects, so when we put '/' here, it will be /projects/ instead of doing to something like '/projects/something'
router.get('/', ProjectController_1.getProjects);
router.post('/', ProjectController_1.createProject);
exports.default = router;
