import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client to interact with the database
const prisma = new PrismaClient();

/**
 * Controller to retrieve tasks for a specific project
 * Includes complete user objects for authors and assignees through Prisma relations
 *
 * @param req Express request object containing projectId query parameter
 * @param res Express response object to send the tasks data
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    // Fetch tasks for the specified project with related data included
    // The 'include' directive automatically performs SQL JOINs behind the scenes
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        // Include the complete author User object by joining on authorUserId
        // This happens automatically because of the relations defined in the Prisma schema
        author: true,

        // Include the complete assignee User object by joining on assignedUserId
        // Will be null if the task is unassigned
        assignee: true,

        // Include all comments related to the task
        comments: true,

        // Include all attachments related to the task
        attachments: true,
      },
    });
    // Return the tasks with their included relations as JSON
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

/**
 * Controller to create a new task
 *
 * @param req Express request object containing task data in the body
 * @param res Express response object to send the created task
 */
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    // Create a new task with the provided data
    // Foreign keys like authorUserId and assignedUserId will create relations
    // that can be queried later using 'include'
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

/**
 * Controller to update the status of a task
 * Also returns the complete task object with related data
 *
 * @param req Express request object containing taskId param and status in body
 * @param res Express response object to send the updated task
 */
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    // Update the task status and return the updated task with related data
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
      // Include relationships to ensure author and assignee data is returned
      // This ensures the UI can display user information after a status update
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating tasks: ${error.message}` });
  }
};
