import { useRouter } from '@tanstack/react-router';
import { Edit, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { convertImageToBase64 } from '~/base/utils/convert-image-to-base-64';
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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { authClient } from '~/lib/auth/auth-client';
import { useSession } from '../hooks/auth-hooks';

const CardUserChangeUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  image: z.instanceof(File).optional(),
});

export function CardUserChangeUser() {
  const { data } = useSession();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      name: data?.user.name,
      image: undefined as File | undefined,
    },
    validators: {
      // @ts-expect-error There should be a way to specify the schema. If function is used the field errors do not always show properly.
      onChange: CardUserChangeUserSchema,
      // onChange: ({ value }) => {
      //   const result = CardUserChangeUserSchema.safeParse(value);
      //   if (!result.success) {
      //     return result.error.issues;
      //   }
      //   return;
      // },
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.updateUser({
          image: value.image ? await convertImageToBase64(value.image) : undefined,
          name: value.name ? value.name : undefined,
          fetchOptions: {
            onSuccess: () => {
              toast.success('User updated successfully');
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        });
        form.reset();
        router.invalidate();
        setImagePreview(null);
        setOpen(false);
      } catch (_error) {
        toast.error('An error occurred while updating user');
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    form.setFieldValue('image', undefined);
    setImagePreview(null);
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button className="gap-2" size="sm" variant="secondary" />}>
        <Edit size={13} />
        Edit User
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <form.AppField
            children={(field) => <field.FormFieldText label={'Full Name'} placeholder="John Doe" type="text" />}
            name="name"
          />
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                  {/** biome-ignore lint/correctness/useImageSize: Allow */}
                  <img alt="Profile preview" className="h-full w-full object-cover" src={imagePreview} />
                </div>
              )}
              <div className="flex w-full items-center gap-2">
                <Input
                  accept="image/*"
                  className="w-full text-muted-foreground"
                  id="image"
                  onChange={handleImageChange}
                  type="file"
                />
                {imagePreview && <X className="cursor-pointer" onClick={clearImage} />}
              </div>
            </div>
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
                {isSubmitting ? <Loader2 className="animate-spin" size={15} /> : 'Update'}
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
