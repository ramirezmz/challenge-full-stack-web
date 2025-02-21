import { z } from "zod";

export const createStudentSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  academic_registration: z.string().optional(),
  identification: z.string().optional(),
});