"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeamControllers_1 = require("../controllers/TeamControllers");
const router = (0, express_1.Router)();
router.get("/", TeamControllers_1.getTeams);
exports.default = router;
