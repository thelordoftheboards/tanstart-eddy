import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { FormFieldPassword } from '~/base-user-interface/components/form-field-password';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/base-user-interface/components/ui/dialog';
import { useAppForm } from '~/base-user-interface/hooks/form';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { authClient } from '~/lib/auth/auth-client';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    signOutDevices: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'The two passwords do not match.',
    path: ['confirmPassword'],
  });

export function DialogChangePassword() {
  const [open, setOpen] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      signOutDevices: false,
    },
    validators: {
      // @ts-expect-error There should be a way to specify the schema. If function is used the field errors do not always show properly.
      onChange: changePasswordSchema,
      // onChange: ({ value }) => {
      //   const result = changePasswordSchema.safeParse(value);
      //   if (!result.success) {
      //     return result.error.issues;
      //   }
      //   return;
      // },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.changePassword({
          newPassword: value.newPassword,
          currentPassword: value.currentPassword,
          revokeOtherSessions: value.signOutDevices,
        });
        if (res.error) {
          toast.error(res.error.message || "Couldn't change your password! Make sure it's correct");
        } else {
          setOpen(false);
          form.reset();
          toast.success('Password changed successfully');
        }
      } catch (_error) {
        toast.error('An error occurred while changing password');
      }
    },
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button className="z-10 gap-2" size="sm" variant="outline" />}>
        <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
          <title>Open change password dialog</title>
          <path
            d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
            fill="currentColor"
          />
        </svg>
        <span className="text-muted-foreground text-sm">{'Change password'}</span>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>{'Change password'}</DialogTitle>
          <DialogDescription>Change your password</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <form.AppField
            children={() => <FormFieldPassword label={'Current password'} placeholder={'Password'} />}
            name="currentPassword"
          />

          <form.AppField
            children={() => <FormFieldPassword label={'New Password'} placeholder={'New Password'} />}
            name="newPassword"
          />

          <form.AppField
            children={() => <FormFieldPassword label={'Confirm Password'} placeholder={'Confirm Password'} />}
            name="confirmPassword"
          />
          <div className="flex items-center gap-2">
            <form.AppField
              children={(field) => (
                <>
                  <Checkbox checked={field.state.value} onCheckedChange={(checked) => field.handleChange(!!checked)} />
                  <p className="text-sm">Sign out devices</p>
                </>
              )}
              name="signOutDevices"
            />
          </div>
        </div>
        <DialogFooter>
          <form.Subscribe
            // @ts-expect-error Tanstack Form type issue
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={15} /> : 'Change password'}
              </Button>
            )}
            // @ts-expect-error Tanstack Form type issue
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
