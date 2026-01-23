import { createFileRoute } from '@tanstack/react-router';
import { handlerDeleteHorse } from '~/tanstart-eddy-examples/server/handler-delete-horse';
import { handlerPutHorse } from '~/tanstart-eddy-examples/server/handler-put-horse';

export const Route = createFileRoute('/api/v1/tanstart-eddy-examples/horses/$id')({
  server: {
    handlers: { PUT: handlerPutHorse, DELETE: handlerDeleteHorse },
  },
});
