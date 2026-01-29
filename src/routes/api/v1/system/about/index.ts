import { createFileRoute } from '@tanstack/react-router';
import { handlerGetAbout } from '~/base-nav-and-auth/server/handler-get-about';

export const Route = createFileRoute('/api/v1/system/about/')({
  server: {
    handlers: { GET: handlerGetAbout },
  },
});
