import { IconInfoSquare } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import {
  BadgeCheck as IconBadgeCheck,
  ChevronsUpDown as IconChevronsUpDown,
  LogOut as IconLogOut,
  Shield as IconShield,
  Users as IconUsers,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar';
import { authClient } from '~/lib/auth/auth-client';
import { authQueryOptions } from '~/lib/auth/queries';
import { getInitials } from '../client/get-initials';
import { ToggleAppearance } from './toggle-appearance';

export function NavUser({
  userCanManageUsers,
  user,
}: {
  userCanManageUsers: boolean;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onResponse: async () => {
          // Manually set to null to avoid unnecessary refetching
          queryClient.setQueryData(authQueryOptions().queryKey, null);

          // TODO // Investigate if some query data survives the log out in this fashion, if so, remove all query data.

          await router.invalidate();

          await router.navigate({ to: '/' });
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              {user.avatar && <AvatarImage alt={user.name} src={user.avatar} />}
              <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <IconChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt={user.name} src={user.avatar} />
                    <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <ToggleAppearance />

            <DropdownMenuSeparator />

            {userCanManageUsers && (
              <>
                <DropdownMenuGroup>
                  {/** biome-ignore lint/a11y/useAnchorContent: Allow */}
                  <DropdownMenuItem render={<a href={'/dashboard/admin'} />}>
                    <IconShield />
                    Admin Overview
                  </DropdownMenuItem>
                  {/** biome-ignore lint/a11y/useAnchorContent: Allow */}
                  <DropdownMenuItem render={<a href={'/dashboard/admin/users'} />}>
                    <IconUsers />
                    Users
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            {/*
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
            */}

            <DropdownMenuGroup>
              {/** biome-ignore lint/a11y/useAnchorContent: Allow */}
              <DropdownMenuItem render={<a href={'/dashboard/account'} />}>
                <IconBadgeCheck />
                Account
              </DropdownMenuItem>

              {/*
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              */}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {/** biome-ignore lint/a11y/useAnchorContent: Allow */}
              <DropdownMenuItem render={<a href={'/dashboard/account/about/'} />}>
                <IconInfoSquare />
                About
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogOut}>
              <IconLogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
