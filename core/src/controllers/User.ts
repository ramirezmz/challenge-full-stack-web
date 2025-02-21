import { Request, Response } from "express";
import { validateBody } from "../utils/validators";
import { createBasicUserSchema } from "../database/Users";
import { hashedPassword } from "../services/hashedPassword";
import prisma from "../lib/prisma";

class UserController {
  async healthCheck(request: Request, response: Response) {
    return response.json({
      message: "Health check ok"
    })
  }
  async create(req: Request, res: Response) {
    const DEFAULT_ROLE = "admin"
    try {
      const content = await validateBody(req, createBasicUserSchema);
      console.log("content: ", content)
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
}

export default new UserController()