import { z } from 'zod';

export const envServerPartMapMaptiler = {
  // Map tiler key for visualizing maps on the client, from https://cloud.maptiler.com/account/keys/
  MAP_MAPTILER_API_KEY_CLIENT: z.string(),
};
