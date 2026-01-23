import { z } from 'zod';

export const optionalEmailSchema = z.preprocess(
  // Convert empty string, undefined, or other falsy values to null
  (val) => (val === '' || val === undefined ? null : val),
  z.union([z.literal(null), z.email('Invalid email address').trim().toLowerCase()])
);
