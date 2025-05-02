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
exports.getTeams = void 0;
const client_1 = require("@prisma/client");
// Initialize the Prisma client to interact with the database
const prisma = new client_1.PrismaClient();
/**
 * Controller function to fetch all teams with expanded user information
 * This function retrieves teams and enriches them with usernames for better display in the UI
 *
 * @param req Express request object
 * @param res Express response object to send the teams data
 */
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First, fetch all teams from the database
        // This only retrieves the basic team data including IDs but not the related user objects
        const teams = yield prisma.team.findMany();
        // Process each team to include the usernames of product owners and project managers
        // We use Promise.all to wait for all async operations to complete in parallel
        const teamsWithUsernames = yield Promise.all(teams.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch the product owner's username using the foreign key
            // The '!' operator asserts that productOwnerUserId is not null (though it might be)
            // We use select to only retrieve the username field for efficiency
            const productOwner = yield prisma.user.findUnique({
                where: { userId: team.productOwnerUserId },
                select: { username: true },
            });
            // Fetch the project manager's username using the foreign key
            // Note: There's a capitalization issue here - 'ProjectManagerUserId' should be 'projectManagerUserId'
            // This could cause errors if the field name doesn't match the database schema
            const projectManager = yield prisma.user.findUnique({
                where: { userId: team.projectManagerUserId },
                select: { username: true },
            });
            // Return an enhanced team object with the usernames included
            // We use the nullish coalescing operator (??) to provide a fallback value if username is null
            // This ensures the frontend always has something to display
            return Object.assign(Object.assign({}, team), { productOwnerUsername: (productOwner === null || productOwner === void 0 ? void 0 : productOwner.username) || "Unknown", projectManagerUsername: (projectManager === null || projectManager === void 0 ? void 0 : projectManager.username) || "Unknown" });
        })));
        // Send the enhanced teams array as JSON
        // This array now includes usernames, making it more useful for the frontend
        res.json(teamsWithUsernames);
    }
    catch (error) {
        // Handle any errors that might occur during database operations
        res
            .status(500)
            .json({ message: `Error retrieving teams: ${error.message}` });
    }
});
exports.getTeams = getTeams;
