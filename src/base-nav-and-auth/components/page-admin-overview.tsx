import {
  Shield as IconShield,
  ShieldCheck as IconShieldCheck,
  UserCheck as IconUserCheck,
  Users as IconUsers,
} from 'lucide-react';
import { InsetContainerWithFloatingTriggerAndTitle } from '~/base-nav-and-auth/components/layout-elements';
import { canManageUsers, type UserRole } from '~/base-nav-and-auth-config/lib/auth/permissions';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { authClient } from '~/lib/auth/auth-client';
import { useUsers } from '../hooks/user-hooks';

export function PageAdminOverview() {
  const { data: users, isLoading } = useUsers();
  const { data: session } = authClient.useSession();

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

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((user) => user.emailVerified && !user.banned).length || 0;
  const bannedUsers = users?.filter((user) => user.banned).length || 0;
  const adminUsers = users?.filter((user) => user.role === 'admin' || user.role === 'superadmin').length || 0;

  return (
    <InsetContainerWithFloatingTriggerAndTitle
      subTitle="Manage users and monitor system activity"
      title="Admin Overview"
    >
      <div className="overflow-scroll">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Users</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{totalUsers}</div>
              <p className="text-muted-foreground text-xs">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Active Users</CardTitle>
              <IconUserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{activeUsers}</div>
              <p className="text-muted-foreground text-xs">Verified and active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Admin Users</CardTitle>
              <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{adminUsers}</div>
              <p className="text-muted-foreground text-xs">Admin and superadmin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Banned Users</CardTitle>
              <IconShield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{bannedUsers}</div>
              <p className="text-muted-foreground text-xs">Suspended accounts</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Admin Permissions</CardTitle>
            <CardDescription>
              Current role: <Badge variant="outline">{currentUserRole}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Manage Users</span>
                <Badge variant={canManageUsers(currentUserRole) ? 'default' : 'secondary'}>
                  {canManageUsers(currentUserRole) ? 'Allowed' : 'Denied'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Ban/Unban Users</span>
                <Badge
                  variant={currentUserRole === 'admin' || currentUserRole === 'superadmin' ? 'default' : 'secondary'}
                >
                  {currentUserRole === 'admin' || currentUserRole === 'superadmin' ? 'Allowed' : 'Denied'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Delete Users</span>
                <Badge variant={currentUserRole === 'superadmin' ? 'default' : 'secondary'}>
                  {currentUserRole === 'superadmin' ? 'Allowed' : 'Denied'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </InsetContainerWithFloatingTriggerAndTitle>
  );
}
