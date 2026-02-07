import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, Loader2, MailPlus, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import CopyToClipboardButton from '~/base-user-interface/components/copy-to-clipboard-button';
import { FormField } from '~/base-user-interface/components/form-field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/base-user-interface/components/ui/dialog';
import { useAppForm } from '~/base-user-interface/hooks/form';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import type { AuthClient } from '~/lib/auth/auth-client';
import { authClient } from '~/lib/auth/auth-client';
import { getInitials } from '../client/get-initials';
import { useSession } from '../hooks/auth-hooks';
import {
  useCancelInvitation,
  useCreateOrganization,
  useInviteMember,
  useOrganizations,
  useRemoveMember,
  useSetActiveOrganization,
} from '../hooks/organization-hooks';

type ActiveOrganization = Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>;

export function OrganizationCard(props: {
  session: AuthClient['$Infer']['Session'] | null;
  activeOrganization: ActiveOrganization | null;
}) {
  const { data: organizations } = useOrganizations();
  const setActiveOrganization = useSetActiveOrganization();
  // const createOrganization = useCreateOrganization();
  // const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const cancelInvitation = useCancelInvitation();

  // TODO // Review if the type issue indicates the need for additional checks
  // @ts-expect-error
  const optimisticOrg = props.activeOrganization as typeof setActiveOrganization.data.data;

  const [isRevoking, setIsRevoking] = useState<string[]>([]);
  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  };

  const { data } = useSession();
  const session = data || props.session;

  const currentMember = optimisticOrg?.members?.find((member) => member.userId === session?.user.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger render={<div className="flex cursor-pointer items-center gap-1" />}>
              <p className="text-sm">
                <span className="font-bold" /> {optimisticOrg?.name || 'Personal'}
              </p>
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="py-1"
                onClick={() => {
                  setActiveOrganization.mutate({
                    organizationId: null,
                  });
                }}
              >
                <p className="sm text-sm">Personal</p>
              </DropdownMenuItem>
              {organizations?.map((org) => (
                <DropdownMenuItem
                  className="py-1"
                  key={org.id}
                  onClick={() => {
                    if (org.id === optimisticOrg?.id) {
                      return;
                    }

                    setActiveOrganization.mutate({
                      organizationId: org.id,
                    });
                  }}
                >
                  <p className="sm text-sm">{org.name}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <CreateOrganizationDialog />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="rounded-none">
            <AvatarImage className="h-full w-full rounded-none object-cover" src={optimisticOrg?.logo || ''} />
            <AvatarFallback className="rounded-none">{getInitials(optimisticOrg?.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p>{optimisticOrg?.name || 'Personal'}</p>
            <p className="text-muted-foreground text-xs">{optimisticOrg?.members.length || 1} 'Members'</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">Members</p>
            <div className="flex flex-col gap-2">
              {optimisticOrg?.members.map((member) => (
                <div className="flex items-center justify-between" key={member.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 sm:flex">
                      <AvatarImage className="object-cover" src={member.user.image || ''} />
                      <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{member.user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {/** biome-ignore lint/style/noNestedTernary: Allow */}
                        {member.role === 'owner' ? 'Owner' : member.role === 'member' ? 'Member' : 'Admin'}
                      </p>
                    </div>
                  </div>
                  {member.role !== 'owner' && (currentMember?.role === 'owner' || currentMember?.role === 'admin') && (
                    <Button
                      onClick={() => {
                        removeMember.mutate({
                          userId: member.id,
                        });
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      {currentMember?.id === member.id ? 'Leave' : 'Remove'}
                    </Button>
                  )}
                </div>
              ))}
              {!optimisticOrg?.id && (
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={session?.user.image || ''} />
                      <AvatarFallback>{getInitials(session?.user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{session?.user.name}</p>
                      <p className="text-muted-foreground text-xs">Owner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">Invites</p>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {optimisticOrg?.invitations
                  .filter((invitation) => invitation.status === 'pending')
                  .map((invitation) => (
                    <motion.div
                      animate="visible"
                      className="flex items-center justify-between"
                      exit="exit"
                      initial="hidden"
                      key={invitation.id}
                      layout
                      variants={inviteVariants}
                    >
                      <div>
                        <p className="text-sm">{invitation.email}</p>
                        <p className="text-muted-foreground text-xs">
                          {/** biome-ignore lint/style/noNestedTernary: Allow */}
                          {invitation.role === 'owner' ? 'Owner' : invitation.role === 'member' ? 'Member' : 'Admin'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={isRevoking.includes(invitation.id)}
                          onClick={() => {
                            setIsRevoking([...isRevoking, invitation.id]);
                            cancelInvitation.mutate(
                              {
                                invitationId: invitation.id,
                              },
                              {
                                onSuccess: () => {
                                  toast.message('Invitation revoked successfully');
                                  setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
                                },
                                onError: () => {
                                  setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
                                },
                              }
                            );
                          }}
                          size="sm"
                          variant="destructive"
                        >
                          {isRevoking.includes(invitation.id) ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            'Revoke'
                          )}
                        </Button>
                        <div>
                          <CopyToClipboardButton
                            textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {optimisticOrg?.invitations.length === 0 && (
                <motion.p
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground text-sm"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  No Active Invitations
                </motion.p>
              )}
              {!optimisticOrg?.id && (
                <Label className="text-muted-foreground text-xs">
                  You can't invite members to your personal workspace.
                </Label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <div>
            <div>{optimisticOrg?.id && <InviteMemberDialog />}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  logo: z.instanceof(File).optional(),
});

function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const createOrganization = useCreateOrganization();

  const form = useAppForm({
    defaultValues: {
      name: '',
      slug: '',
      logo: undefined as File | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const result = createOrganizationSchema.safeParse(value);
        if (!result.success) {
          return result.error.issues;
        }
        return;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        let logoBase64: string | undefined;
        if (value.logo) {
          logoBase64 = await convertImageToBase64(value.logo);
        }

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
      } catch (_error) {
        toast.error('An error occurred while creating organization');
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

  const convertImageToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    form.setFieldValue('logo', undefined);
    setLogoPreview(null);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button className="w-full gap-2" size="sm" variant="default" />}>
        <PlusIcon />
        <p>New Organization</p>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
          <DialogDescription>Create a new organization to collaborate with your team.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <form.AppField
              children={(field) => <FormField field={field} label={'Organization Name'} placeholder={'Name'} />}
              name="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <form.AppField
              children={(field) => (
                <div>
                  <Label htmlFor={field.name}>Organization Slug</Label>
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
                  {field.state.meta.errors && (
                    <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
              name="slug"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Logo</Label>
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
                <button
                  className="text-destructive text-sm hover:text-destructive/80"
                  onClick={clearLogo}
                  type="button"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <form.Subscribe
            // @ts-expect-error Tanstack Form type issue
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting || createOrganization.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                {createOrganization.isPending || isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
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

const inviteMemberSchema = z.object({
  email: z.email('Please enter a valid email address'),
  role: z.enum(['admin', 'member'], 'Please select a role'),
});

function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const inviteMember = useInviteMember();

  const form = useAppForm({
    defaultValues: {
      email: '',
      role: 'member' as 'admin' | 'member',
    },
    validators: {
      onChange: inviteMemberSchema,

      // onChange: ({ value }) => {
      //   const result = inviteMemberSchema.safeParse(value);
      //   if (!result.success) {
      //     return result.error.issues;
      //   }
      //   return;
      // },
    },
    onSubmit: ({ value }) => {
      inviteMember.mutate(
        {
          email: value.email,
          role: value.role,
        },
        {
          onSuccess: () => {
            toast.success('Member invited successfully');
            form.reset();
            setOpen(false);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    },
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button className="w-full gap-2" size="sm" variant="secondary" />}>
        <MailPlus size={16} />
        <p>Invite Member</p>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Invite a member to your organization.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <form.AppField
                children={(field) => <FormField field={field} label={'Email'} placeholder={'Email'} type="email" />}
                name="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <form.AppField
                children={(field) => (
                  <Select
                    onValueChange={(value) => field.handleChange(value as 'admin' | 'member')}
                    value={field.state.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={'Select a user'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                name="role"
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <form.Subscribe
            // @ts-expect-error Tanstack Form type issue
            children={([canSubmit, isSubmitting]) => (
              <DialogClose
                render={
                  <Button
                    disabled={!canSubmit || isSubmitting || inviteMember.isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                  />
                }
              >
                {inviteMember.isPending || isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Invite'}
              </DialogClose>
            )}
            // @ts-expect-error Tanstack Form type issue
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
