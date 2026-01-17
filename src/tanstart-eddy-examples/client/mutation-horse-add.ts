import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationFnPost } from '~/base-nav-and-auth/client/mutation-fn-post';
import { type HorseNoIdType, HorseSchema, type HorseType } from '../schema/horse';

export function useMutationHorseAdd(options?: UseMutationOptions<HorseType, Error, HorseNoIdType>) {
  const {
    mutationFn: _,
    onSuccess,
    onError,
    ...extraOptions
  } = options ?? { mutationFn: null, onSuccess: null, onError: null };

  const queryClient = useQueryClient();
  return useMutation<HorseType, Error, HorseNoIdType>({
    mutationFn: (data) => mutationFnPost<HorseType, HorseNoIdType>('/api/v1/eddy/horses/', data),

    onSuccess: (data, variables, onMutateResult, context) => {
      if (HorseSchema.safeParse(data).success) {
        //
        queryClient.invalidateQueries({ queryKey: ['horse'] });
        //
        console.log('Added successfully:', data);
        if (onSuccess) {
          onSuccess(data, variables, onMutateResult, context);
        }
      } else {
        console.error('Error adding, recevied:', data);
        if (onError) {
          onError(new Error('Data received from server, but is incorrect'), variables, onMutateResult, context);
        }
      }
    },

    onError: (error, variables, onMutateResult, context) => {
      console.error('Error adding:', error);
      if (onError) {
        onError(error, variables, onMutateResult, context);
      }
    },

    ...extraOptions,
  });
}
