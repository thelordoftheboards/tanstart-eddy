import { Loader2, PencilIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
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
import { FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useCreateOrganization, useUpdateOrganization } from '../hooks/organization-hooks';

// Per https://github.com/onurzorluer/react-image-file-resizer/issues/68#issuecomment-1400516800
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  logo: z.instanceof(File).optional(),
});

export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;

type Organization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export function CreateOrganizationDialog(props: { organization?: Organization }) {
  const isEditMode = !!props.organization;
  const [open, setOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(props.organization?.logo || null);
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const form = useAppForm({
    defaultValues: {
      name: props.organization?.name || '',
      slug: props.organization?.slug || '',
      logo: undefined as File | undefined,
    } satisfies CreateOrganizationType as CreateOrganizationType,
    validators: {
      onSubmit: createOrganizationSchema,
      //   ({ value }) => {
      //   const result = createOrganizationSchema.safeParse(value);
      //   if (!result.success) {
      //     return result.error.issues;
      //   }
      //   return;
      // },
    },
    onSubmit: async ({ value }) => {
      try {
        let logoBase64: string | undefined;
        if (value.logo) {
          logoBase64 = await convertImageToBase64(value.logo);
        }

        if (isEditMode && props.organization) {
          updateOrganization.mutate(
            {
              organizationId: props.organization.id,
              name: value.name,
              logo: logoBase64,
            },
            {
              onSuccess: () => {
                toast.success('Organization updated successfully');
                setOpen(false);
                setLogoPreview(null);
                setIsSlugEdited(false);
              },
              onError: (error) => {
                toast.error(error.message);
              },
            }
          );
        } else {
          createOrganization.mutate(
            {
              name: value.name,
              slug: value.slug,
              logo: logoBase64,
            },
            {
              onSuccess: () => {
                toast.success('Organization created successfully');
                setOpen(false);
                form.reset();
                setLogoPreview(null);
                setIsSlugEdited(false);
              },
              onError: (error) => {
                toast.error(error.message);
              },
            }
          );
        }
      } catch (_error) {
        toast.error('An error occurred while saving organization');
      }
    },
  });

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!isSlugEdited && form.state.values.name) {
      const generatedSlug = form.state.values.name.trim().toLowerCase().replace(/\s+/g, '-');
      form.setFieldValue('slug', generatedSlug);
    }
  }, [form, form.state.values.name, form.setFieldValue, isSlugEdited]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resizer.imageFileResizer(file, 192, 192, 'webp', 90, 0, handleLogoChangeForResized, 'file');
    }
  };

  const handleLogoChangeForResized = (imageFile: string | Blob | File | ProgressEvent<FileReader>) => {
    if (!(imageFile instanceof File)) {
      throw new Error('assert');
    }

    form.setFieldValue('logo', imageFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  };

  const clearLogo = () => {
    form.setFieldValue('logo', undefined);
    setLogoPreview(null);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="gap-2" size="sm" variant={isEditMode ? 'secondary' : 'default'}>
            {isEditMode ? <PencilIcon size={16} /> : <PlusIcon />}
            <p>{isEditMode ? 'Edit' : 'Create New'}</p>
          </Button>
        }
      />
      <DialogContent className="w-11/12 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Organization' : 'New Organization'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update your organization details.'
              : 'Create a new organization to collaborate with your team.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <form.AppField
              children={(field) => <field.FormFieldText label={'Organization Name'} placeholder={'Name'} />}
              name="name"
            />
          </div>

          {!isEditMode && (
            <div className="flex flex-col gap-2">
              <form.AppField
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Organization Slug</FieldLabel>
                        <FieldDescription>
                          ⚠️ WARNING: Once the organization has been creted, the slug can not be changed. Choose
                          carefully.
                        </FieldDescription>
                      </FieldContent>
                      <Input
                        className="mt-1"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setIsSlugEdited(true);
                        }}
                        placeholder="organization-slug"
                        type="text"
                        value={field.state.value}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
                name="slug"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <FieldContent>
              <FieldLabel>Logo</FieldLabel>
            </FieldContent>
            <Input accept="image/*" onChange={handleLogoChange} type="file" />
            {logoPreview && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  alt="Logo preview"
                  className="h-16 w-16 rounded object-cover"
                  height={16}
                  src={logoPreview}
                  width={16}
                />
                {!isEditMode && (
                  <button
                    className="text-destructive text-sm hover:text-destructive/80"
                    onClick={clearLogo}
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <form.Subscribe
            // @ts-expect-error Tanstack Form type issue
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting || createOrganization.isPending || updateOrganization.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                {createOrganization.isPending || isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                  // biome-ignore lint/style/noNestedTernary: Allow
                ) : isEditMode ? (
                  'Update'
                ) : (
                  'Create'
                )}
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
