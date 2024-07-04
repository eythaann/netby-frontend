import { z } from "zod";

export type Task = z.infer<typeof TaskSchema>;
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  creationDate: z.string().transform((val) => new Date(val)),
  expirationDate: z.string().transform((val) => new Date(val)),
  isCompleted: z.boolean(),
})