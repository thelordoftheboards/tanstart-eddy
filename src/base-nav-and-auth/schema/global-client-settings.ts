import { z } from 'zod';

export const globalClientSettingsSchema = z.object({
  mapMaptilerApiKeyClient: z.string(),
});

export type GlobalClientSettingsType = z.infer<typeof globalClientSettingsSchema>;
