import { queryOptions } from '@tanstack/react-query';
import { queryFnGet } from '~/base-nav-and-auth/client/query-fn-get';
import { type HorseType } from '../schema/horse';

export const queryOptionsHorses = () =>
  queryOptions({
    queryKey: ['horse'],
    queryFn: () => queryFnGet<HorseType[]>('/api/v1/tanstart-eddy-examples/horses'),
  });
