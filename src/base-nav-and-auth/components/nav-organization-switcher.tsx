import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar';
import { authClient } from '~/lib/auth/auth-client';
import { getInitials } from '../client/get-initials';
import { useOrganizations, useSetActiveOrganization } from '../hooks/organization-hooks';

export function NavOrganizationSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: organizations } = useOrganizations();
  const setActiveOrganization = useSetActiveOrganization();

  const { isMobile } = useSidebar();
  const activeOrganization = organizations?.filter((org) => org.id === session?.session.activeOrganizationId)[0];

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
            {!activeOrganization && (
              <>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">??</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">No organization</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </>
            )}
            {activeOrganization && (
              <>
                <Avatar className="h-8 w-8 rounded-lg">
                  {activeOrganization.logo && (
                    <AvatarImage alt={activeOrganization.name} src={activeOrganization.logo} />
                  )}
                  <AvatarFallback className="rounded-lg">{getInitials(activeOrganization.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeOrganization.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
              {organizations?.map((organization, index) => (
                <DropdownMenuItem
                  className="gap-2 p-2"
                  key={organization.name}
                  onClick={() => {
                    setActiveOrganization.mutate({
                      organizationId: organization.id,
                    });
                  }}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {organization.logo && <AvatarImage alt={organization.name} src={organization.logo} />}
                    <AvatarFallback className="rounded-lg">{getInitials(organization.name)}</AvatarFallback>
                  </Avatar>
                  {organization.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            {/*
              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
              </DropdownMenuItem>
            */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
