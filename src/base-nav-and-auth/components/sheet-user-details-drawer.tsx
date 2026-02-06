import { format } from 'date-fns';
import {
  Calendar as IconCalendar,
  Check as IconCheck,
  Copy as IconCopy,
  Shield as IconShield,
  ShieldCheck as IconShieldCheck,
  User as IconUser,
  UserCheck as IconUserCheck,
  X as IconX,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  canBanUsers,
  canImpersonateUsers,
  canSetUserRoles,
  getAssignableRoles,
  type UserRole,
} from '~/base-nav-and-auth-config/lib/auth/permissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/base-user-interface/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/base-user-interface/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';
import { getInitials } from '../client/get-initials';
import {
  useBanUser,
  useResetUserPassword,
  useRevokeUserSessions,
  useSetUserRole,
  useUnbanUser,
} from '../hooks/user-hooks';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  createdAt: Date;
  image?: string;
}

interface SheetUserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: UserRole;
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'superadmin':
      return (
        <Badge className="border-purple-200 bg-purple-50 font-medium text-purple-700" variant="outline">
          <IconShield className="mr-1 h-3 w-3" />
          Super Admin
        </Badge>
      );
    case 'admin':
      return (
        <Badge className="border-indigo-200 bg-indigo-50 font-medium text-indigo-700" variant="outline">
          <IconShieldCheck className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    case 'user':
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
          <IconUserCheck className="mr-1 h-3 w-3" />
          User
        </Badge>
      );
    default:
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
          {role}
        </Badge>
      );
  }
}

function getStatusBadge(user: User) {
  if (user.banned) {
    return (
      <Badge className="border-red-200 bg-red-50 font-medium text-red-700" variant="outline">
        <IconX className="mr-1 h-3 w-3" />
        Banned
      </Badge>
    );
  }
  if (user.emailVerified) {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700" variant="outline">
        <IconCheck className="mr-1 h-3 w-3" />
        Active
      </Badge>
    );
  }
  return (
    <Badge className="border-amber-200 bg-amber-50 font-medium text-amber-700" variant="outline">
      Pending
    </Badge>
  );
}

function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  currentUserRole,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: UserRole;
}) {
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || 'user');
  const { mutate: setUserRole, isPending } = useSetUserRole();

  const assignableRoles = getAssignableRoles(currentUserRole);

  const handleRoleChange = () => {
    if (!user) {
      return;
    }

    setUserRole(
      { userId: user.id, role: selectedRole },
      {
        onSuccess: () => {
          toast.success('User role updated successfully');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update user role');
        },
      }
    );
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'User';
      case 'admin':
        return 'Admin';
      case 'superadmin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'Basic access with limited permissions';
      case 'admin':
        return 'Can manage users and organization settings';
      case 'superadmin':
        return 'Full system access including user deletion and impersonation';
      default:
        return '';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            {/* @ts-expect-error The values passed in below should never be null */}
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex flex-col">
                      <span className="font-medium">{getRoleDisplayName(role)}</span>
                      <span className="text-muted-foreground text-xs">{getRoleDescription(role)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && selectedRole !== user.role && (
            <div className="rounded-lg bg-muted p-3">
              <p className="mb-1 font-medium text-sm">
                {selectedRole === 'superadmin' && 'Granting Super Admin access'}
                {selectedRole === 'admin' && 'Granting Admin access'}
                {selectedRole === 'user' && 'Removing admin privileges'}
              </p>
              <p className="text-muted-foreground text-xs">{getRoleDescription(selectedRole as UserRole)}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending || selectedRole === user.role} onClick={handleRoleChange}>
              {isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate: resetPassword, isPending } = useResetUserPassword();

  const handleResetPassword = () => {
    if (!user) {
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    resetPassword(
      { userId: user.id, password },
      {
        onSuccess: () => {
          toast.success('Password reset successfully');
          setPassword('');
          setConfirmPassword('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to reset password');
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset the password for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              type="password"
              value={password}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending || !password || password !== confirmPassword} onClick={handleResetPassword}>
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BanUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState('');
  const { mutate: banUser, isPending } = useBanUser();

  const handleBanUser = () => {
    if (!user) {
      return;
    }

    banUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success('User banned successfully');
          setReason('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to ban user');
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban {user.name} ({user.email}) from the platform
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Ban</Label>
            <Textarea
              id="reason"
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for banning this user"
              rows={3}
              value={reason}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending || !reason.trim()} onClick={handleBanUser} variant="destructive">
              {isPending ? 'Banning...' : 'Ban User'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SheetUserDetailsDrawer({ user, open, onOpenChange, currentUserRole }: SheetUserDetailsDrawerProps) {
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [banUserOpen, setBanUserOpen] = useState(false);

  const { mutate: revokeUserSessions, isPending: isRevokingSessions } = useRevokeUserSessions();
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser();

  const copyUserId = () => {
    if (user) {
      navigator.clipboard.writeText(user.id);
      toast.success('User ID copied to clipboard');
    }
  };

  const copyUserEmail = () => {
    if (user) {
      navigator.clipboard.writeText(user.email);
      toast.success('Email copied to clipboard');
    }
  };

  const handleRevokeAllSessions = () => {
    if (!user) {
      return;
    }
    revokeUserSessions(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success('All user sessions revoked');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to revoke sessions');
        },
      }
    );
  };

  const handleUnbanUser = () => {
    if (!user) {
      return;
    }
    unbanUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success('User unbanned successfully');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to unban user');
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent className="w-150 overflow-y-auto sm:w-175">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>Comprehensive information and actions for {user.name}</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <Tabs className="space-y-4" defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent className="space-y-4" value="overview">
                {/* User Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage alt={user.name} src={user.image} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Status</span>
                      {getStatusBadge(user)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Role</span>
                      {getRoleBadge(user.role)}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">User ID</p>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">{user.id.slice(0, 8)}...</code>
                          <Button onClick={copyUserId} size="sm" variant="ghost">
                            <IconCopy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">Member Since</p>
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <IconCalendar className="h-3 w-3" />
                          {format(user.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">Email</p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">{user.email}</span>
                          <Button onClick={copyUserEmail} size="sm" variant="ghost">
                            <IconCopy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">Email Verified</p>
                        <p className="flex items-center gap-1 text-muted-foreground">
                          {user.emailVerified ? (
                            <>
                              <IconCheck className="h-3 w-3 text-green-600" />
                              Verified
                            </>
                          ) : (
                            <>
                              <IconX className="h-3 w-3 text-red-600" />
                              Not Verified
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent className="space-y-4" value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>User activity and session information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground">
                      <IconUser className="mx-auto mb-2 h-8 w-8" />
                      <p>Activity tracking coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent className="space-y-4" value="actions">
                <Card>
                  <CardHeader>
                    <CardTitle>Administrative Actions</CardTitle>
                    <CardDescription>Manage this user's account and permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Session Management */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <h4 className="font-medium">Revoke All Sessions</h4>
                        <p className="text-muted-foreground text-sm">Sign out user from all devices</p>
                      </div>
                      <Button
                        disabled={isRevokingSessions}
                        onClick={handleRevokeAllSessions}
                        size="sm"
                        variant="outline"
                      >
                        {isRevokingSessions ? 'Revoking...' : 'Revoke'}
                      </Button>
                    </div>

                    {/* Role Management */}
                    {canSetUserRoles(currentUserRole) && (
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h4 className="font-medium">Change Role</h4>
                          <p className="text-muted-foreground text-sm">Modify user permissions and access level</p>
                        </div>
                        <Button onClick={() => setChangeRoleOpen(true)} size="sm" variant="outline">
                          Change Role
                        </Button>
                      </div>
                    )}

                    {/* Password Reset */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <h4 className="font-medium">Reset Password</h4>
                        <p className="text-muted-foreground text-sm">Set a new password for this user</p>
                      </div>
                      <Button onClick={() => setResetPasswordOpen(true)} size="sm" variant="outline">
                        Reset Password
                      </Button>
                    </div>

                    {/* Ban/Unban User */}
                    {canBanUsers(currentUserRole) && (
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h4 className="font-medium">{user.banned ? 'Unban User' : 'Ban User'}</h4>
                          <p className="text-muted-foreground text-sm">
                            {user.banned
                              ? 'Restore user access to the platform'
                              : 'Restrict user access to the platform'}
                          </p>
                        </div>
                        {user.banned ? (
                          <Button disabled={isUnbanning} onClick={handleUnbanUser} size="sm" variant="outline">
                            {isUnbanning ? 'Unbanning...' : 'Unban'}
                          </Button>
                        ) : (
                          <Button onClick={() => setBanUserOpen(true)} size="sm" variant="destructive">
                            Ban User
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Impersonate (Super Admin only) */}
                    {canImpersonateUsers(currentUserRole) && (
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h4 className="font-medium">Impersonate User</h4>
                          <p className="text-muted-foreground text-sm">Login as this user (super admin only)</p>
                        </div>
                        <Button size="sm" variant="secondary">
                          Impersonate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <ChangeRoleDialog
        currentUserRole={currentUserRole}
        onOpenChange={setChangeRoleOpen}
        open={changeRoleOpen}
        user={user}
      />
      <ResetPasswordDialog onOpenChange={setResetPasswordOpen} open={resetPasswordOpen} user={user} />
      <BanUserDialog onOpenChange={setBanUserOpen} open={banUserOpen} user={user} />
    </>
  );
}
