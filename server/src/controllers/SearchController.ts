import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// To use prisma and grap data from the database
const prisma = new PrismaClient();

// when we call the /projects route, this function will be called
export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
      include: {
        author: true, 
        assignee: true, 
        comments: true, 
        attachments: true, 
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string, mode: "insensitive" } }],
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
      // Get unique projects the user has authored tasks for
      const ownedProjects = user.authoredTasks
        .map((task) => task.project)
        .filter(
          (project, index, self) =>
            index === self.findIndex((p) => p.id === project.id)
        );

      // Get unique projects the user is assigned to via tasks
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
      const allAssignedProjects = [...assignedProjects, ...teamProjects].filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      );

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
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
