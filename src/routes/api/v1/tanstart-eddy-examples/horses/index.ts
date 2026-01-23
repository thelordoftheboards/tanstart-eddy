import { createFileRoute } from '@tanstack/react-router';
import { handlerGetHorses } from '~/tanstart-eddy-examples/server/handler-get-horses';
import { handlerPostHorse } from '~/tanstart-eddy-examples/server/handler-post-horse';

export const Route = createFileRoute('/api/v1/tanstart-eddy-examples/horses/')({
  server: {
    handlers: { GET: handlerGetHorses, POST: handlerPostHorse },
  },
});
