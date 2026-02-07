import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { authClient } from '~/lib/auth/auth-client';
import { MenuItemType } from '../schema/menu-item';

export function NavAppSidebarItemMenu({
  items,
  sidebarGroupLabel,
}: {
  items: MenuItemType[];
  sidebarGroupLabel?: string;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: session } = authClient.useSession();
  const hasOrganization = session?.session.activeOrganizationId ?? false;

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      {sidebarGroupLabel && <SidebarGroupLabel>{sidebarGroupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item: MenuItemType) => (
          <React.Fragment key={item.title}>
            {'items' in item && (hasOrganization || !item.requiresOrganization) && (
              <Collapsible className="group/collapsible" defaultOpen={item.isActive} render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <React.Fragment key={subItem.title}>
                        {(hasOrganization || !subItem.requiresOrganization) && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton render={<Link onClick={closeSidebarOnMobile} to={subItem.url} />}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </React.Fragment>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )}
            {'url' in item && (hasOrganization || !item.requiresOrganization) && (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<Link onClick={closeSidebarOnMobile} to={item.url} />}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
