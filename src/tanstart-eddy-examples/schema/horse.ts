import { z } from 'zod';

export const horseSchema = z.object({
  id: z.uuid({ message: 'ID must be a valid UUID', version: 'v7' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).describe('e.g., Thunder, Moonlight'),
  breed: z.string().describe('e.g., Arabian, Quarter Horse, Thoroughbred'),
  birthYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .describe("The horse's year of birth (e.g., 2015)"),
  colorAndMarkings: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .describe('e.g., Bay with white blaze, Dapple grey'),
  stallNumber: z
    .string()
    .regex(/^[A-Z0-9]+$/i, { message: 'Stall number must be alphanumeric' })
    .describe('The horse\'s assigned stall number (e.g., "Stall 1A", 42)'),
});

export type HorseType = z.infer<typeof horseSchema>;

export const horseNoIdSchema = horseSchema.omit({ id: true });

export type HorseNoIdType = z.infer<typeof horseNoIdSchema>;
