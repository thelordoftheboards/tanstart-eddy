import { createFileRoute } from '@tanstack/react-router';
import { getAbout } from '~/base-nav-and-auth/api/get-about';

export const Route = createFileRoute('/api/v1/system/about/')({
  server: {
    handlers: { GET: getAbout },
  },
});
