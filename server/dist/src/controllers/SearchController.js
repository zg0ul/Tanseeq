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
// Initialize Prisma client to interact with the database
const prisma = new client_1.PrismaClient();
/**
 * Search controller handler for the /search endpoint
 * This controller performs a global search across tasks, projects, and users
 * using the provided query string
 *
 * @param req Express request object containing the search query
 * @param res Express response object to send the search results
 */
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the search query from request parameters
    const { query } = req.query;
    try {
        // Search for tasks matching the query in title or description
        // Also include related entities (author, assignee, comments, attachments)
        // The 'include' directive tells Prisma to perform JOINs to get the related data
        const tasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                author: true, // Include complete author user object using the authorUserId foreign key
                assignee: true, // Include complete assignee user object using the assignedUserId foreign key
                comments: true, // Include all comments related to this task
                attachments: true, // Include all attachments related to this task
            },
        });
        // Search for projects matching the query in name or description
        const projects = yield prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        // Search for users matching the query in username
        // Also include their authored tasks, assigned tasks, and team information
        const users = yield prisma.user.findMany({
            where: {
                OR: [{ username: { contains: query, mode: "insensitive" } }],
            },
            include: {
                // Include tasks authored by the user along with project details
                // This creates a nested object structure through Prisma's relation handling
                authoredTasks: {
                    include: {
                        project: true, // Include project details for each authored task
                    },
                },
                // Include tasks assigned to the user along with project details
                assignedTasks: {
                    include: {
                        project: true, // Include project details for each assigned task
                    },
                },
                // Include team information for the user along with related project teams
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
        // Process users to extract and deduplicate their owned and assigned projects
        // This transforms the nested data structure into a more frontend-friendly format
        const enhancedUsers = users.map((user) => {
            var _a;
            // Get unique projects the user has authored tasks for
            // The filter removes duplicate projects based on project ID
            const ownedProjects = user.authoredTasks
                .map((task) => task.project)
                .filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Get unique projects the user is assigned to via tasks
            // Using similar deduplication logic as above
            const assignedProjects = user.assignedTasks
                .map((task) => task.project)
                .filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Get unique projects the user is part of via team membership
            const teamProjects = ((_a = user.team) === null || _a === void 0 ? void 0 : _a.projectTeams.map((pt) => pt.project)) || [];
            // Combine all assigned projects (from direct task assignments and team membership)
            // And deduplicate them to avoid showing the same project multiple times
            const allAssignedProjects = [...assignedProjects, ...teamProjects].filter((project, index, self) => index === self.findIndex((p) => p.id === project.id));
            // Return user with simplified project information
            // This structure makes it easier for the frontend to display the data
            return {
                userId: user.userId,
                cognitoId: user.cognitoId,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
                teamId: user.teamId,
                ownedProjects, // Projects where the user has authored tasks
                assignedProjects: allAssignedProjects, // Projects assigned to the user (via tasks or team)
            };
        });
        // Send the combined search results as JSON
        res.json({ tasks, projects, users: enhancedUsers });
    }
    catch (error) {
        // Handle any errors that occur during the search process
        res
            .status(500)
            .json({ message: `Error performing search: ${error.message}` });
    }
});
exports.search = search;
