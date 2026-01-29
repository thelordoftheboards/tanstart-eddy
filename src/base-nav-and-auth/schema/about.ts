import { z } from 'zod';

export const aboutSchema = z.object({
  npm_package_version: z.string(),
});

export type AboutType = z.infer<typeof aboutSchema>;
