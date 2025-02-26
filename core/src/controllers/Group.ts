import { Request, Response } from "express";
import prisma from "../lib/prisma";

class GroupController {
  async listAll(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const requestingUser = req.user;
      const query: any = {
        AND: []
      }

      if (requestingUser.role === "student") {
        query.AND.push({
          registrations: {
            some: {
              studentId: requestingUser.id
            }
          }
        })
      }
      if (search) {
        query.AND.push({
          code: {
            contains: search as string,
            mode: 'insensitive'
          }
        })
      }

      const groups = await prisma.group.findMany({
        include: {
          course: true,
          registrations: {
            include: {
              student: true
            }
          }
        },
        where: query,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({
        message: "Groups retrieved successfully",
        body: groups
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
        error
      });
    }
  }
}

export default new GroupController();