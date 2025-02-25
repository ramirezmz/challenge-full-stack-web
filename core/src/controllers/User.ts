import { Request, Response } from "express";
import { validateBody } from "../utils/validators";
import { createBasicUserSchema } from "../database/Users";
import { comparePassword, hashedPassword } from "../services/hashedPassword";
import prisma from "../lib/prisma";
import { generateToken } from "../services/token";

class UserController {
  async healthCheck(request: Request, response: Response) {
    return response.json({
      message: "Health check ok"
    })
  }
  async create(req: Request, res: Response) {
    const DEFAULT_ROLE = "admin"

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden"
      })
    }
    try {
      const content = await validateBody(req, createBasicUserSchema);
      let newHashedPassword = null;

    if (!content?.password) {
      res.status(400).json({
        message: "Password is required",
      });
    }
    newHashedPassword = await hashedPassword(content.password);

    const payload = {
      ...content,
      password: newHashedPassword,
    };

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        role: DEFAULT_ROLE
      },
    });

    // create profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "POST request successful",
      body: {
        user: userWithoutPassword,
        profile,
      },
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
      const { role, search } = req.query;
      const requestingUser = req.user;

      const query: any = {
        AND: []
      }

      if (requestingUser.role === "student") {
        query.AND.push({
          role: "student"
        })
      } else if (role && ['student', 'admin'].includes(role as string)) {
        query.AND.push({
          role: role
        })
      }

      if (search) {
        query.AND.push({
          profile: {
            name: {
              contains: search as string,
              mode: "insensitive"
            }
          }
        })
      }

      if (query.AND.length === 0) {
        delete query.AND;
      }

      const users = await prisma.user.findMany({
        where: query,
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
        message: "GET request successful",
        body: users,
      });
    } catch (error) {
      console.log("error: ", error)
      res.status(500).json({
        message: "Something went wrong",
        error: error
      })
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const content = await validateBody(req, createBasicUserSchema);

    const user = await prisma.user.findUnique({
      where: {
        email: content.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = comparePassword(content.password, user?.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id, user.role);

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      body: { token, user: userWithoutPassword },
    });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error
      })
    }
  }

  async updateOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, name, academic_registration, identification } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: { profile: true }
      });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id },
          data: {
            updatedById: req.user.id,
            email: email || undefined,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            profile: true
          }
        });

        if (existingUser.profile && (name || academic_registration || identification)) {
          await tx.profile.update({
            where: { userId: id },
            data: {
              name: name || undefined,
              academic_registration: academic_registration || undefined,
              identification: identification || undefined
            }
          });
        }

        return user;
      });

      return res.status(200).json({
        message: "User updated successfully",
        body: updatedUser
      });
    } catch (error) {
      console.log("MEME: ", error)
      return res.status(500).json({
        message: "Something went wrong",
        error: error
      });
    }
  }

  async deleteOne(req: Request, res: Response) {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden"
      })
    }
    try {
      const { id } = req.params;
      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: { 
          profile: {
            include: {
              registrations: true
            }
          }
        }
      });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await prisma.$transaction(async (tx) => {
        if (existingUser.profile) {
          if (existingUser.profile.registrations.length > 0) {
            await tx.registration.deleteMany({
              where: {
                studentId: existingUser.profile.id
              }
            });
          }

          await tx.profile.delete({
            where: { userId: id }
          });
        }

        await tx.user.delete({
          where: { id }
        });
      });

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.log("error: ", error)
      return res.status(500).json({
        message: "Something went wrong",
        error: error
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: {
          include: {
            registrations: true
          }
        }}
      });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        message: "User retrieved successfully",
        body: existingUser
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        error: error
      });
    }
  }
}

export default new UserController()