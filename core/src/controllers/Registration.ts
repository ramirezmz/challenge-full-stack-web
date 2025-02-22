import { Request, Response } from "express";
import prisma from "../lib/prisma";

class RegistrationController {
  async create(req: Request, res: Response) {
    try {
      const { userId, groupId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user || user.role !== 'student') {
        return res.status(404).json({ message: "Student not found" });
      }

      // Verify if group exists
      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Check if registration already exists
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          studentId: user.profile!.id,
          groupId
        }
      });

      if (existingRegistration) {
        return res.status(400).json({ message: "Student already registered in this group" });
      }

      // Create registration
      const registration = await prisma.registration.create({
        data: {
          studentId: user.profile!.id,
          groupId,
          status: 'active'
        },
        include: {
          student: true,
          group: {
            include: {
              course: true
            }
          }
        }
      });

      return res.status(201).json({
        message: "Registration created successfully",
        body: registration
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error
      });
    }
  }

  async listByStudent(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user || user.role !== 'student') {
        return res.status(404).json({ message: "Student not found" });
      }

      const registrations = await prisma.registration.findMany({
        where: {
          studentId: user.profile!.id
        },
        include: {
          group: {
            include: {
              course: true
            }
          }
        }
      });

      return res.status(200).json({
        message: "Registrations retrieved successfully",
        body: registrations
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error
      });
    }
  }

  async updatedStatus(req: Request, res: Response) {
    try {
      const { userId, groupId } = req.params;
      const { status } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
      if (!user || user.role!=='student') {
        return res.status(404).json({ message: "Student not found" });
      }
      const registration = await prisma.registration.findFirst({
        where: {
          studentId: user.profile!.id,
          groupId
        }
      });
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      const updatedRegistration = await prisma.registration.update({
        where: { id: registration.id },
        data: { status },
        include: {
          group: {
            include: {
              course: true
            }
          }
        }
      });
      return res.status(200).json({
        message: "Registration updated successfully",
        body: updatedRegistration
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error
      });
    }
  }
}

export default new RegistrationController();