import { createFileRoute } from '@tanstack/react-router';
import { handlerGetGlobalClientSettings } from '~/base-nav-and-auth/server/handler-get-global-client-settings';

export const Route = createFileRoute('/api/v1/system/global-client-settings/')({
  server: {
    handlers: { GET: handlerGetGlobalClientSettings },
  },
});
