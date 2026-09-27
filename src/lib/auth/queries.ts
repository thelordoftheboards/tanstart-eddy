import { queryOptions } from '@tanstack/react-query';
import { $getUser } from './functions';

export const authQueryOptions = () =>
  queryOptions({
    queryFn: ({ signal }) => $getUser({ signal }),
    queryKey: ['user'],
  });

export type AuthQueryResult = Awaited<ReturnType<typeof $getUser>>;
