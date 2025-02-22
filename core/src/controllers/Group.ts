import { Request, Response } from "express";
import prisma from "../lib/prisma";

class GroupController {
  async listAll(req: Request, res: Response) {
    try {
      const groups = await prisma.group.findMany({
        include: {
          course: true,
          registrations: {
            include: {
              student: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({
        message: "Groups retrieved successfully",
        body: groups
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error
      });
    }
  }
}

export default new GroupController();