import { envServerPartBaseEmail } from '~/base-email/lib/env-server-part';
import { envServerPartMapMaptiler } from '~/map-maptiler/lib/env-server-part';

export const envServerParts = {
  ...envServerPartMapMaptiler,
  ...envServerPartBaseEmail,
};
