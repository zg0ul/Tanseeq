import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client to interact with the database
const prisma = new PrismaClient();

/**
 * Search controller handler for the /search endpoint
 * This controller performs a global search across tasks, projects, and users
 * using the provided query string
 *
 * @param req Express request object containing the search query
 * @param res Express response object to send the search results
 */
export const search = async (req: Request, res: Response): Promise<void> => {
  // Extract the search query from request parameters
  const { query } = req.query;
  try {
    // Search for tasks matching the query in title or description
    // Also include related entities (author, assignee, comments, attachments)
    // The 'include' directive tells Prisma to perform JOINs to get the related data
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
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
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    // Search for users matching the query in username
    // Also include their authored tasks, assigned tasks, and team information
    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string, mode: "insensitive" } }],
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
      // Get unique projects the user has authored tasks for
      // The filter removes duplicate projects based on project ID
      const ownedProjects = user.authoredTasks
        .map((task) => task.project)
        .filter(
          (project, index, self) =>
            index === self.findIndex((p) => p.id === project.id)
        );

      // Get unique projects the user is assigned to via tasks
      // Using similar deduplication logic as above
      const assignedProjects = user.assignedTasks
        .map((task) => task.project)
        .filter(
          (project, index, self) =>
            index === self.findIndex((p) => p.id === project.id)
        );

      // Get unique projects the user is part of via team membership
      const teamProjects =
        user.team?.projectTeams.map((pt) => pt.project) || [];

      // Combine all assigned projects (from direct task assignments and team membership)
      // And deduplicate them to avoid showing the same project multiple times
      const allAssignedProjects = [...assignedProjects, ...teamProjects].filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      );

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
  } catch (error: any) {
    // Handle any errors that occur during the search process
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
