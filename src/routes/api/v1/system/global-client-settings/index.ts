import { createFileRoute } from '@tanstack/react-router';
import { getGlobalClientSettings } from '~/base-nav-and-auth/api/get-global-client-settings';

export const Route = createFileRoute('/api/v1/system/global-client-settings/')({
  server: {
    handlers: { GET: getGlobalClientSettings },
  },
});
