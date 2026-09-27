import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserRole } from '~/base-nav-and-auth-config/lib/auth/permissions';
import { authClient } from '~/lib/auth/auth-client';

const userQueryKeys = {
  all: ['users'] as const,
  list: () => [...userQueryKeys.all, 'list'] as const,
  passkeys: () => ['passkeys'] as const,
  sessions: () => ['sessions'] as const,
  twoFactor: () => ['twoFactor'] as const,
};

export const useUsers = () => {
  return useQuery({
    queryFn: async () => {
      const data = await authClient.admin.listUsers(
        {
          query: {
            limit: 10,
            sortBy: 'createdAt',
            sortDirection: 'desc',
          },
        },
        {
          throw: true,
        }
      );

      return data?.users || [];
    },
    queryKey: userQueryKeys.list(),
    retry: (failureCount, error: Error) => {
      // Don't retry if it's a permission error
      if (error.message.includes('forbidden')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSessions = () =>
  useQuery({
    queryFn: async () => {
      const getSession = authClient.getSession();
      const getSessions = authClient.listSessions();
      const getOrganization = authClient.organization.getFullOrganization();
      const [session, organization, sessions] = await Promise.all([getSession, getOrganization, getSessions]);
      return { organization, session, sessions } as const;
    },
    queryKey: userQueryKeys.sessions(),
    retry: (failureCount, error: Error) => {
      if (error.message.includes('forbidden')) {
        return false;
      }
      return failureCount < 2;
    },
  });

// export const usePasskeys = () => {
//   const passkeys = authClient.useListPasskeys();
//   return passkeys;
// };

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
      role,
    }: {
      email: string;
      password: string;
      name: string;
      role?: UserRole | UserRole[];
    }) => {
      const result = await authClient.admin.createUser({
        email,
        name,
        password,
        role: role || 'user',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to create user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Create user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.removeUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to remove user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Remove user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.removeUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Delete user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useSetUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const result = await authClient.admin.setRole({
        role,
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to set user role');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Set user role error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      const result = await authClient.admin.setUserPassword({
        newPassword: password,
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to reset user password');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Reset user password error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useRevokeUserSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.revokeUserSessions({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to revoke user sessions');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Revoke user sessions error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
  });
};

export const useImpersonateUser = () =>
  useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.impersonateUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to impersonate user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Impersonate user error:', error);
    },
  });

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.banUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to ban user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Ban user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.unbanUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to unban user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Unban user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const result = await authClient.revokeSession({
        token,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to revoke session');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Revoke session error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
  });
};

export const useSendVerificationEmail = () =>
  useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const result = await authClient.sendVerificationEmail(
        {
          email,
        },
        {
          throw: true,
        }
      );

      if (!result.status) {
        throw new Error('Failed to send verification email');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Send verification email error:', error);
    },
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, image }: { name?: string; image?: string }) => {
      const result = await authClient.updateUser({
        image,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update user');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Update user error:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      revokeOtherSessions,
    }: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to change password');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Change password error:', error);
    },
  });

// TODO // Enable passkey
/*
export const useAddPasskey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const result = await authClient.passkey.addPasskey({
        name,
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Failed to add passkey');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.passkeys() });
    },
    onError: (error: Error) => {
      console.error('Add passkey error:', error);
    },
  });
};

export const useDeletePasskey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ passkeyId }: { passkeyId: string }) => {
      const result = await authClient.passkey.deletePasskey({
        id: passkeyId,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete passkey');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.passkeys() });
    },
    onError: (error: Error) => {
      console.error('Delete passkey error:', error);
    },
  });
};
*/

// TODO // Add code to enable two factor authentication
// Two Factor Authentication hooks
/*
export const useGetTotpUri = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const result = await authClient.twoFactor.getTotpUri({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to get TOTP URI');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Get TOTP URI error:', error);
    },
  });
};

export const useEnableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { totp?: string; password: string }) => {
      const result = await authClient.twoFactor.enable({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to enable two-factor authentication');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.twoFactor() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error('Enable two-factor error:', error);
    },
  });
};

export const useDisableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const result = await authClient.twoFactor.disable({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to disable two-factor authentication');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.twoFactor() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error('Disable two-factor error:', error);
    },
  });
};

export const useVerifyTwoFactor = () => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const result = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to verify two-factor authentication');
      }

      return result;
    },
    onError: (error: Error) => {
      console.error('Verify two-factor error:', error);
    },
  });
};
 */
