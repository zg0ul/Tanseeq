import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize the Prisma client to interact with the database
const prisma = new PrismaClient();

/**
 * Controller function to fetch all teams with expanded user information
 * This function retrieves teams and enriches them with usernames for better display in the UI
 *
 * @param req Express request object
 * @param res Express response object to send the teams data
 */
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    // First, fetch all teams from the database
    // This only retrieves the basic team data including IDs but not the related user objects
    const teams = await prisma.team.findMany();

    // Process each team to include the usernames of product owners and project managers
    // We use Promise.all to wait for all async operations to complete in parallel
    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        // Fetch the product owner's username using the foreign key
        // The '!' operator asserts that productOwnerUserId is not null (though it might be)
        // We use select to only retrieve the username field for efficiency
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        // Fetch the project manager's username using the foreign key
        // Note: There's a capitalization issue here - 'ProjectManagerUserId' should be 'projectManagerUserId'
        // This could cause errors if the field name doesn't match the database schema
        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        // Return an enhanced team object with the usernames included
        // We use the nullish coalescing operator (??) to provide a fallback value if username is null
        // This ensures the frontend always has something to display
        return {
          ...team, // Include all original team properties
          productOwnerUsername: productOwner?.username || "Unknown", // Add product owner's username
          projectManagerUsername: projectManager?.username || "Unknown", // Add project manager's username
        };
      })
    );

    // Send the enhanced teams array as JSON
    // This array now includes usernames, making it more useful for the frontend
    res.json(teamsWithUsernames);
  } catch (error: any) {
    // Handle any errors that might occur during database operations
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};
