import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationFnPut } from '~/base-nav-and-auth/client/mutation-fn-put';
import { type HorseType, horseSchema } from '../schema/horse';

export function useMutationHorseUpdate(options?: UseMutationOptions<HorseType, Error, HorseType>) {
  const {
    mutationFn: _,
    onSuccess,
    onError,
    ...extraOptions
  } = options ?? { mutationFn: null, onSuccess: null, onError: null };

  const queryClient = useQueryClient();
  return useMutation<HorseType, Error, HorseType>({
    mutationFn: (data) => mutationFnPut<HorseType, HorseType>(`/api/v1/tanstart-eddy-examples/horses/${data.id}`, data),

    onSuccess: (data, variables, onMutateResult, context) => {
      if (horseSchema.safeParse(data).success) {
        //
        queryClient.invalidateQueries({ queryKey: ['horse'] });
        //
        console.log('Updated successfully:', data);
        if (onSuccess) {
          onSuccess(data, variables, onMutateResult, context);
        }
      } else {
        console.error('Error updating, recevied:', data);
        if (onError) {
          onError(new Error('Data received from server, but is incorrect'), variables, onMutateResult, context);
        }
      }
    },

    onError: (error, variables, onMutateResult, context) => {
      console.error('Error updating:', variables, error);
      if (onError) {
        onError(error, variables, onMutateResult, context);
      }
    },

    ...extraOptions,
  });
}
