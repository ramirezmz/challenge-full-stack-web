import { Request, Response } from "express";
import { validateBody } from "../utils/validators";
import { createStudentSchema } from "../database/Students";
import prisma from "../lib/prisma";

class StudentController {
  async create(req: Request, res: Response) {
    const DEFAULT_ROLE = "student"
    try {
      const content = await validateBody(req, createStudentSchema);

      const userWithSameIdentification = await prisma.profile.findFirst({
        where: {
          identification: content.identification
        }
      });

      if (userWithSameIdentification) {
        return res.status(400).json({
          message: "User with same identification already exists"
        })
      }
      const userWithSameAcademicRegistration = await prisma.profile.findFirst({
        where: {
          academic_registration: content.academic_registration
        }
      });

      if (userWithSameAcademicRegistration) {
        return res.status(400).json({
          message: "User with same academic registration already exists"
        })
      }
      
      const user = await prisma.user.create({
        data: {
          email: content.email,
          role: DEFAULT_ROLE,
          profile: {
            create: {
              name: content.name,
              academic_registration: content.academic_registration,
              identification: content.identification
            }
          }
        },
        include: {
          profile: true
        }
      });

      const { password, ...userWithoutPassword } = user;

      res.status(201).json({
        message: "Student created successfully",
        body: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error
      })
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "student"
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json({
        message: "Students retrieved successfully",
        body: students,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error
      })
    }
  }
}

export default new StudentController();