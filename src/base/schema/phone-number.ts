import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

// TODO // Add support for parsePhoneNumberWithError instead of parsePhoneNumber

export const phoneNumberSchema = z
  .string()
  .describe('e.g., (111) 111-1111')
  .refine((val) => isValidPhoneNumber(val, 'US'), {
    message: 'Invalid phone number',
  })
  .transform((val) => parsePhoneNumber(val, 'US').number.toString()); // Normalizes to E.164 (e.g., +12125550123)

export const optionalPhoneSchema = z.preprocess(
  // 1. Convert empty strings or undefined to null
  (val) => (val === '' || val === undefined ? null : val),
  z
    .union([
      // 2. Allow literal null
      z.literal(null),
      // 3. Or validate a string as a proper US phone number
      z
        .string()
        .refine((val) => isValidPhoneNumber(val, 'US'), {
          message: 'Invalid USA phone number',
        })
        .transform((val) => parsePhoneNumber(val, 'US').number.toString()), // Normalizes to E.164 (e.g., +12125550123)
    ])
    .describe('e.g., (111) 111-1111, or empty')
);
