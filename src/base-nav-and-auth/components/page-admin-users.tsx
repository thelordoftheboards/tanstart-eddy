/** biome-ignore-all lint/style/noNestedTernary: Allow */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity:Allow */

import {
  Ban as IconBan,
  CheckCircle as IconCheckCircle,
  Eye as IconEye,
  Filter as IconFilter,
  MoreHorizontal as IconMoreHorizontal,
  RefreshCw as IconRefreshCw,
  Search as IconSearch,
  Shield as IconShield,
  ShieldCheck as IconShieldCheck,
  Trash2 as IconTrash2,
  UserCheck as IconUserCheck,
  UserPlus as IconUserPlus,
  Users as IconUsers,
  UserX as IconUserX,
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/base/components/ui/dialog';
import { InsetContainerWithFloatingTriggerAndTitle } from '~/base-nav-and-auth/components/layout-elements';
import {
  canBanUsers,
  canCreateUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canManageUsers,
  canSetUserRoles,
  type UserRole,
} from '~/base-nav-and-auth-config/lib/auth/permissions';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { authClient } from '~/lib/auth/auth-client';
import {
  useBanUser,
  useCreateUser,
  useDeleteUser,
  useImpersonateUser,
  useRevokeUserSessions,
  useSetUserRole,
  useUnbanUser,
  useUsers,
} from '../hooks/user-hooks';
import { SheetUserDetailsDrawer } from './sheet-user-details-drawer';

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

function getStatusBadge(user: User) {
  if (user.banned) {
    return (
      <Badge className="border-red-200 bg-red-50 font-medium text-red-700" variant="outline">
        <IconBan className="mr-1 h-3 w-3" />
        Banned
      </Badge>
    );
  }
  if (user.emailVerified) {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700" variant="outline">
        <IconCheckCircle className="mr-1 h-3 w-3" />
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

function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'user' });
      },
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button size="sm" />}>
        <IconUserPlus className="mr-2 h-4 w-4" />
        Create User
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Create a new user account with the specified details.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              value={formData.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              type="email"
              value={formData.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              type="password"
              value={formData.password}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, role: value })} value={formData.role}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PageAdminUsers() {
  const { data: session } = authClient.useSession();
  const { data: users, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mutate: banUser } = useBanUser();
  const { mutate: unbanUser } = useUnbanUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: setUserRole } = useSetUserRole();
  const { mutate: impersonateUser } = useImpersonateUser();
  const { mutate: revokeUserSessions } = useRevokeUserSessions();
  //const { mutate: resetPassword } = useResetUserPassword();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';

  if (!canManageUsers(currentUserRole)) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <IconShield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="font-semibold text-lg text-muted-foreground">Access Denied</h3>
          <p className="text-muted-foreground text-sm">You don't have permission to access admin features.</p>
        </div>
      </div>
    );
  }

  const normalizedUsers: User[] =
    users?.map((user) => ({
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role || 'user',
      emailVerified: user.emailVerified,
      banned: user.banned,
      createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
      image: user.image || undefined,
    })) || [];

  const filteredUsers = normalizedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.emailVerified && !user.banned) ||
      (statusFilter === 'pending' && !user.emailVerified && !user.banned) ||
      (statusFilter === 'banned' && user.banned);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (action: string, userId: string, userRole?: string) => {
    const user = normalizedUsers.find((u) => u.id === userId);

    switch (action) {
      case 'view':
        if (user) {
          setSelectedUser(user);
          setDrawerOpen(true);
        }
        break;
      case 'ban':
        if (canBanUsers(currentUserRole)) {
          banUser({ userId });
        }
        break;
      case 'unban':
        if (canBanUsers(currentUserRole)) {
          unbanUser({ userId });
        }
        break;
      case 'delete':
        if (canDeleteUsers(currentUserRole)) {
          deleteUser({ userId });
        }
        break;
      case 'setRole':
        if (canSetUserRoles(currentUserRole) && userRole) {
          setUserRole({ userId, role: userRole });
        }
        break;
      case 'impersonate':
        if (canImpersonateUsers(currentUserRole)) {
          impersonateUser({ userId });
        }
        break;
      case 'revokeSession':
        if (canManageUsers(currentUserRole)) {
          revokeUserSessions({ userId });
        }
        break;
      default:
        throw new Error(`action=${action} not supported.`);
    }
  };

  const stats = {
    total: normalizedUsers.length,
    active: normalizedUsers.filter((u) => u.emailVerified && !u.banned).length,
    pending: normalizedUsers.filter((u) => !(u.emailVerified || u.banned)).length,
    banned: normalizedUsers.filter((u) => u.banned).length,
    admins: normalizedUsers.filter((u) => u.role === 'admin' || u.role === 'superadmin').length,
  };

  return (
    <InsetContainerWithFloatingTriggerAndTitle
      subTitle="Manage users, roles, and permissions"
      title="User Management"
      titleExtraElements={
        <div className="mx-2 flex grow flex-row-reverse flex-wrap items-center gap-2">
          {canCreateUsers(currentUserRole) && <CreateUserDialog />}
        </div>
      }
    >
      <div className="overflow-scroll">
        {/* Header */}
        <div className="flex items-center justify-between" />
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Users</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Active</CardTitle>
              <IconCheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-emerald-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Pending</CardTitle>
              <IconUserCheck className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Banned</CardTitle>
              <IconBan className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-red-600">{stats.banned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Admins</CardTitle>
              <IconShield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-purple-600">{stats.admins}</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <IconSearch className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="w-[300px] pl-8"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    value={searchTerm}
                  />
                </div>

                {/* Status Filter */}
                <Select onValueChange={setStatusFilter} value={statusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <IconFilter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select onValueChange={setRoleFilter} value={roleFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="py-8 text-center" colSpan={5}>
                      <div className="flex items-center justify-center">
                        <IconRefreshCw className="mr-2 h-6 w-6 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-8 text-center text-muted-foreground" colSpan={5}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage alt={user.name} src={user.image} />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-sm">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{user.createdAt.toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button className="h-8 w-8 p-0" variant="ghost" />}>
                            <span className="sr-only">Open menu</span>
                            <IconMoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleUserAction('view', user.id)}>
                                <IconEye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction('revokeSession', user.id)}>
                                <IconRefreshCw className="mr-2 h-4 w-4" />
                                Revoke Sessions
                              </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {canSetUserRoles(currentUserRole) && (
                              <DropdownMenuItem onClick={() => handleUserAction('setRole', user.id, 'admin')}>
                                <IconShieldCheck className="mr-2 h-4 w-4" />
                                Make Admin
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {canBanUsers(currentUserRole) &&
                              (user.banned ? (
                                <DropdownMenuItem onClick={() => handleUserAction('unban', user.id)}>
                                  <IconCheckCircle className="mr-2 h-4 w-4" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction('ban', user.id)}>
                                  <IconUserX className="mr-2 h-4 w-4" />
                                  Ban User
                                </DropdownMenuItem>
                              ))}

                            {canImpersonateUsers(currentUserRole) && (
                              <DropdownMenuItem onClick={() => handleUserAction('impersonate', user.id)}>
                                <IconEye className="mr-2 h-4 w-4" />
                                Impersonate
                              </DropdownMenuItem>
                            )}

                            {canDeleteUsers(currentUserRole) && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleUserAction('delete', user.id)}
                              >
                                <IconTrash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* User Details Drawer */}
        <SheetUserDetailsDrawer
          currentUserRole={currentUserRole}
          onOpenChange={setDrawerOpen}
          open={drawerOpen}
          user={selectedUser}
        />
      </div>
    </InsetContainerWithFloatingTriggerAndTitle>
  );
}
