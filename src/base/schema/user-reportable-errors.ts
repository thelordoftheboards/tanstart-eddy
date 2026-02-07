import { z } from 'zod';

export const userReportableErrorsSchema = z.array(
  z.object({
    errorCode: z.string(),
    message: z.string(),
  })
);

export type UserReportableErrorsType = z.infer<typeof userReportableErrorsSchema>;
