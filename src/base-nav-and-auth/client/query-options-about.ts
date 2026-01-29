import { queryOptions } from '@tanstack/react-query';
import { queryFnGet } from '~/base-nav-and-auth/client/query-fn-get';
import { type AboutType } from '../schema/about';

export const queryOptionsAbout = () =>
  queryOptions({
    queryKey: ['about'],
    queryFn: () => queryFnGet<AboutType>('/api/v1/system/about'),
  });
