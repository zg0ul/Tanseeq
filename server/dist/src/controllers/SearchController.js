"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("@prisma/client");
// To use prisma and grap data from the database
const prisma = new client_1.PrismaClient();
// when we call the /projects route, this function will be called
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const tasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        const projects = yield prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        const users = yield prisma.user.findMany({
            where: {
                OR: [{ username: { contains: query, mode: "insensitive" } }],
            },
            include: {
                // Include tasks authored by the user
                authoredTasks: {
                    include: {
                        project: true, // Include project details for each authored task
                    },
                },
                // Include tasks assigned to the user
                assignedTasks: {
                    include: {
                        project: true, // Include project details for each assigned task
                    },
                },
                // Include team information for the user
                team: {
                    include: {
                        projectTeams: {
                            include: {
                                project: true, // Include projects the user is part of through their team
                            },
                        },
                    },
                },
            },
        });
        // Process users to extract their owned and assigned projects
        const enhancedUsers = users.map((user) => {
            var _a;
            // Get unique projects the user has authored tasks for
            const ownedProjects = user.authoredTasks
                .map((task) => task.project)
                .filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Get unique projects the user is assigned to via tasks
            const assignedProjects = user.assignedTasks
                .map((task) => task.project)
                .filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Get unique projects the user is part of via team membership
            const teamProjects = ((_a = user.team) === null || _a === void 0 ? void 0 : _a.projectTeams.map((pt) => pt.project)) || [];
            // Combine all assigned projects (from direct task assignments and team membership)
            const allAssignedProjects = [...assignedProjects, ...teamProjects].filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Return user with simplified project information
            return {
                userId: user.userId,
                cognitoId: user.cognitoId,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
                teamId: user.teamId,
                ownedProjects,
                assignedProjects: allAssignedProjects,
            };
        });
        res.json({ tasks, projects, users: enhancedUsers });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error performing search: ${error.message}` });
    }
});
exports.search = search;
