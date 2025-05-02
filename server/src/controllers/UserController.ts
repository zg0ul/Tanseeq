import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// To use prisma and grap data from the database
const prisma = new PrismaClient();

// when we call the /projects route, this function will be called
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};
