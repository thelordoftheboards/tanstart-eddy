import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { FormFieldPassword } from '~/base/components/form-field-password';
import { useAppForm } from '~/base/hooks/form';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { authClient } from '~/lib/auth/auth-client';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The two passwords do not match.',
    path: ['confirmPassword'],
  });

export default function ResetPasswordForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: resetPasswordSchema,

      // onChange: ({ value }) => {
      //   const result = resetPasswordSchema.safeParse(value);
      //   if (!result.success) {
      //     return result.error.issues;
      //   }
      //   return;
      // },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.resetPassword({
          newPassword: value.password,
          // biome-ignore lint/style/noNonNullAssertion: Allow
          token: new URLSearchParams(window.location.search).get('token')!,
        });
        if (res.error) {
          toast.error(res.error.message);
        } else {
          router.navigate({ to: '/login' });
        }
      } catch (_error) {
        toast.error('An error occurred during password reset');
      }
    },
  });
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-88">
        <CardHeader>
          <CardTitle>{'Reset Password'}</CardTitle>
          <CardDescription>{'Enter your new password'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid w-full items-center gap-2">
              <div className="flex flex-col space-y-1.5">
                <form.AppField
                  children={(field) => (
                    <FormFieldPassword field={field} label={'New Password'} placeholder={'Password'} />
                  )}
                  name="password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <form.AppField
                  children={(field) => (
                    <FormFieldPassword field={field} label={'Confirm new password'} placeholder={'Password'} />
                  )}
                  name="confirmPassword"
                />
              </div>
            </div>
            <form.Subscribe
              children={([canSubmit, isSubmitting]) => (
                <Button className="mt-4 w-full" disabled={!canSubmit || isSubmitting} type="submit">
                  {isSubmitting ? 'Resetting' : 'Reset password'}
                </Button>
              )}
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
