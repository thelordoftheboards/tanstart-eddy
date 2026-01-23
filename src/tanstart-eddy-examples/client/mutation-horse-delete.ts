import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { mutationFnDelete } from '~/base-nav-and-auth/client/mutation-fn-delete';

const DeleteSchema = z.object({
  id: z.uuid({ version: 'v7' }),
  success: z.literal(true),
});

export function useMutationHorseDelete(
  options?: UseMutationOptions<{ id: string; success: boolean }, Error, { id: string }>
) {
  const {
    mutationFn: _,
    onSuccess,
    onError,
    ...extraOptions
  } = options ?? { mutationFn: null, onSuccess: null, onError: null };

  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; id: string }, Error, { id: string }>({
    mutationFn: (data) =>
      mutationFnDelete<{ success: boolean; id: string }, { id: string }>(
        `/api/v1/tanstart-eddy-examples/horses/${data.id}`,
        data
      ),

    onSuccess: (data, variables, onMutateResult, context) => {
      if (DeleteSchema.safeParse(data).success) {
        //
        queryClient.invalidateQueries({ queryKey: ['horse'] });
        //
        console.log('Deleted successfully:', data);
        if (onSuccess) {
          onSuccess(data, variables, onMutateResult, context);
        }
      } else {
        console.error('Error deleting, recevied:', data);
        if (onError) {
          onError(new Error('Data received from server, but is incorrect'), variables, onMutateResult, context);
        }
      }
    },

    onError: (error, variables, onMutateResult, context) => {
      console.error('Error deleting:', error);
      if (onError) {
        onError(error, variables, onMutateResult, context);
      }
    },

    ...extraOptions,
  });
}
