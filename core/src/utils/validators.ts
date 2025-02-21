import { Request } from "express";
import { z } from "zod";

export async function validateBody<T>(
  req: Request,
  schema: z.ZodSchema<T>,
): Promise<T> {
  try {
    return schema.parse(req.body);
  } catch (error) {
    throw error
  }
}
